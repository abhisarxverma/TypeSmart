import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import is_clean_text, send_email

def get_user_view(request):
    sb = getattr(request, "sb", None)
    user = getattr(request, "sb_user", None)

    if not sb or not user:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    try:
        existing_resp = sb.table("users").select("*").eq("id", user.id).single().execute()

        print("EXISTING USER : ", existing_resp)

        if existing_resp.data:
            return JsonResponse(existing_resp.data, status=200, safe=False)

        insert_resp = (
            sb.table("users")
            .insert(
                {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.user_metadata.get("full_name", ""),
                    "avatar_url": user.user_metadata.get("avatar_url", ""),
                }
            )
            .select("*")
            .single()
            .execute()
        )

        if insert_resp.error:
            return JsonResponse(
                {"error": "Failed to create new user", "details": insert_resp.error},
                status=500,
            )

        return JsonResponse(insert_resp.data, status=200, safe=False)

    except Exception as e:
        print("ERROR IN GET USER VIEW : ", e)
        return JsonResponse(
            {"error": "Unexpected server error", "details": str(e)}, status=500
        )

def parse_body(request):
    """Safely parse JSON body for vanilla Django."""
    try:
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return {}

@csrf_exempt
def upload_text(request):
    sb = getattr(request, "sb", None)
    user = getattr(request, "sb_user", None)

    try:
        body = parse_body(request)
        title, text, tag = body.get("title"), body.get("text"), body.get("tag")

        if not title or not text or not tag:
            return JsonResponse({"error": "Incomplete details provided"}, status=400)

        inserted = (
            sb.table("texts")
            .insert(
                {
                    "user_id": user.id,
                    "title": title,
                    "text": text,
                    "tag": tag,
                }
            )
            .execute()
        )

        print("INSERT RESPONSE:", inserted)

        return JsonResponse(inserted.data[0], safe=False, status=200)

    except Exception as e:
        print("Error in add text view : ", e)
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

def get_library(request):
    sb = getattr(request, "sb", None)

    try:
        texts = sb.table("texts").select("*").order("uploaded_at", desc=True).execute()

        groups = (
            sb.table("groups")
            .select("*, group_texts:group_texts(importance, added_at, texts(*))")
            .order("created_at", desc=True)
            .execute()
        )

        flattened = []
        for g in groups.data:
            group_texts = [
                {**gt["texts"], "importance": gt["importance"], "added_at": gt["added_at"]}
                for gt in g.get("group_texts", [])
            ]
            flattened.append({**g, "group_texts": group_texts})

        return JsonResponse({"groups": flattened, "texts": texts.data}, status=200)
    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def create_group(request):
    sb = getattr(request, "sb", None)
    user = getattr(request, "sb_user", None)

    try:
        body = parse_body(request)
        name, tag = body.get("name"), body.get("tag")

        if not name:
            return JsonResponse({"error": "Please provide the folder name"}, status=400)

        insert_response = (
            sb.table("groups")
            .insert({"user_id": user.id, "name": name, "tag": tag})
            .execute()
        )

        if not insert_response.data:
            return JsonResponse({"error": "Group creation failed"}, status=500)

        group_id = insert_response.data[0]["id"]

        fetch_response = sb.table("groups").select("*").eq("id", group_id).execute()

        if not fetch_response.data:
            return JsonResponse({"error": "Failed to retrieve created group"}, status=500)

        return JsonResponse(fetch_response.data[0], safe=False, status=200)

    except Exception as e:
        print("Error in create group view : ", e)
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def add_in_group(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        text_id, group_id = body.get("text_id"), body.get("group_id")

        if not text_id or not group_id:
            return JsonResponse({"error": "Missing data in request"}, status=400)

        text = sb.table("texts").select("*").eq("id", text_id).single().execute()

        group = sb.table("groups").select("*").eq("id", group_id).single().execute()

        existing = sb.table("group_texts").select("*").eq("text_id", text_id).eq("group_id", group_id).execute()
    
        if len(existing.data) > 0:
            return JsonResponse({"error": "Text already present in the group"}, status=400)

        inserted = sb.table("group_texts").insert({"text_id": text.data["id"], "group_id": group.data["id"]}).execute()

        enriched = {**text.data, "importance": "medium"}
        return JsonResponse(enriched, status=200)
    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def remove_from_group(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        text_id, group_id = body.get("text_id"), body.get("group_id")

        if not text_id or not group_id:
            return JsonResponse({"error": "Missing data in request"}, status=400)

        text = sb.table("texts").select("*").eq("id", text_id).single().execute()

        group = sb.table("groups").select("*").eq("id", group_id).single().execute()

        presence = sb.table("group_texts").select("*").eq("text_id", text_id).eq("group_id", group_id).execute()
    
        if len(presence.data) <= 0:
            return JsonResponse({"error": "Text not present in group"}, status=400)

        deleted = sb.table("group_texts").delete().match({"text_id": text.data["id"], "group_id": group.data["id"]}).execute()

        return JsonResponse(text.data, status=200)
    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def edit_text(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        title, text_val, tag, text_id = body.get("title"), body.get("text"), body.get("tag"), body.get("textId")

        if not title or not text_val or not tag or not text_id:
            return JsonResponse({"error": "Incomplete details provided"}, status=400)

        update_response = (
            sb.table("texts")
            .update({"title": title, "text": text_val, "tag": tag})
            .eq("id", text_id)
            .execute()
        )

        if not update_response.data:
            return JsonResponse({"error": "Text not found or update failed"}, status=404)

        fetch_response = sb.table("texts").select("*").eq("id", text_id).execute()

        if not fetch_response.data:
            return JsonResponse({"error": "Failed to retrieve updated text"}, status=500)

        return JsonResponse(fetch_response.data[0], safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def update_importance(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        text_id, group_id, importance = body.get("textId"), body.get("groupId"), body.get("importance")

        if not text_id or not group_id or not importance:
            return JsonResponse({"error": "Incomplete request"}, status=400)

        update_response = (
            sb.table("group_texts")
            .update({"importance": importance})
            .eq("text_id", text_id)
            .eq("group_id", group_id)
            .execute()
        )

        if not update_response.data:
            return JsonResponse({"error": "Importance update failed"}, status=404)

        text_response = sb.table("texts").select("*").eq("id", text_id).execute()

        if not text_response.data:
            return JsonResponse({"error": "Text not found"}, status=404)

        enriched = {**text_response.data[0], "importance": importance}
        return JsonResponse(enriched, status=200)

    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)


@csrf_exempt
def delete_text(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        text_id = body.get("textId")

        if not text_id:
            return JsonResponse({"error": "Incomplete data in request"}, status=400)

        deleted = sb.table("texts").delete().eq("id", text_id).execute()

        return JsonResponse({"message": "Deletion successful"}, status=200)
    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def delete_group(request):
    sb = getattr(request, "sb", None)

    try:
        body = parse_body(request)
        group_id = body.get("groupId")

        if not group_id:
            return JsonResponse({"error": "Incomplete data in request"}, status=400)

        deleted = sb.table("groups").delete().eq("id", group_id).execute()

        return JsonResponse({"message": "Deletion successful"}, status=200)
    except Exception as e:
        return JsonResponse({"error": "Unexpected server error", "details": str(e)}, status=500)

@csrf_exempt
def send_feedback(request):
    try:
        body = json.loads(request.body)
        message = body.get("text")
        print("Received review message:", message)
        if not message:
            return JsonResponse({"success": False, "message": "Message is required"})

        if not is_clean_text(message):
            return JsonResponse({"success": False, "message": "Message contains invalid characters"})
        
        send_email(message)
        return JsonResponse({"success": True, "message": "Review submitted successfully"})

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Failed to submit review: {str(e)}"})