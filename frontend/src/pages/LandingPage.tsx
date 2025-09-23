import { Button } from "@/components/ui/button";
import { giveTypingPageRoute } from "@/utils/routing";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MdOutlineFeedback } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { BsSend } from "react-icons/bs";
import { useSendFeedbackMutation } from "@/Hooks/useBackend";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LandingPage() {

    const [ feedbackText, setFeedbackText ] = useState<string>("");

    const { sendFeedback, isSendingFeedback } = useSendFeedbackMutation(feedbackText)

    return (
        <>
            <header className="flex items-center justify-between py-3 px-3 md:px-8 border-b-2 border-secondary">
                <div className="flex items-center gap-2">
                    <img className="h-8 aspect-square" src="/logo.png" alt="Typesmart logo image" />
                    <span className="text-xl font-bold">TypeSmart</span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost"><MdOutlineFeedback /> Give Feedback</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[300px]">
                        <DialogHeader>
                            <DialogTitle>Share your valuable feedback</DialogTitle>
                            <DialogDescription className="flex flex-col gap-5 mt-3">
                                <Textarea onChange={(e) => setFeedbackText(e.target.value)} placeholder="Send your reviews, suggestions, advices, critiques straight to me...." className="resize-none min-h-[150px]"/>
                                <Button onClick={()=>sendFeedback()}>{isSendingFeedback ? <Loader2 className="animate-spin"/> : <BsSend />} Send feedback</Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </header>
            <div className="min-h-[80vh] max-w-3xl text-center flex flex-col justify-center align-center mx-auto">
                <h1 className="text-5xl font-bold">Learn stuff unknowingly with chill mode typing</h1>
                <p className="text-gray-400 font-semibold mt-5 max-w-2xl mx-auto">Increase your typing speed by typing your own texts, so you can learn them unknowingly with having fun</p>
                <div className="flex items-center gap-2 justify-center mt-10">
                    <Button className="px-5"><FaGoogle /> One click login / signup</Button>
                    <Button variant="secondary" className="px-5 border-1 border-secondary" asChild>
                        <Link to={giveTypingPageRoute("demo")}>Take Demo</Link>
                    </Button>
                </div>
            </div>
            <div className="bg-card py-5 px-3 md:px-8 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img className="h-6 aspect-square" src="/logo.png" alt="Typesmart logo image" />
                        <span className="text-lg font-bold">TypeSmart</span>
                    </div>
                    <p className="text-muted-foreground text-md" >© 2025 Typesmart. All rights reserved.</p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                    <FaGithub className="text-[40px]"/>
                    <p className="text-lg font-semibold">Github Open Sourced</p>
                </div>
            </div>
        </>
    )
}