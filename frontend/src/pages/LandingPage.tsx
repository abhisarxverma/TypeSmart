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
} from "@/components/ui/dialog";
import { MdOutlineFeedback } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { BsSend } from "react-icons/bs";
import { useSendFeedbackMutation } from "@/Hooks/useBackend";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/Hooks/useAuth";

export default function LandingPage() {
    const [feedbackText, setFeedbackText] = useState<string>("");

    const { user, signInWithGoogle } = useAuth();

    const { sendFeedback, isSendingFeedback } = useSendFeedbackMutation(
        feedbackText
    );

    return (
        <div className="min-h-screen grid grid-cols-1 grid-rows-[auto_1fr_auto]">
            <header className="flex items-center justify-between py-3 px-3 md:px-8 border-b-2 border-secondary">
                <div className="flex items-center gap-2">
                    <img
                        className="h-8 aspect-square"
                        src="/logo.png"
                        alt="Typesmart logo image"
                    />
                    <span className="text-xl font-bold">TypeSmart</span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <MdOutlineFeedback /> Give Feedback
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[300px]">
                        <DialogHeader>
                            <DialogTitle>Share your valuable feedback</DialogTitle>
                            <DialogDescription className="flex flex-col gap-5 mt-3">
                                <Textarea
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder="Send your reviews, suggestions, advices, critiques straight to me...."
                                    className="resize-none min-h-[150px]"
                                />
                                <Button onClick={() => sendFeedback()}>
                                    {isSendingFeedback ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <BsSend />
                                    )}{" "}
                                    Send feedback
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="min-h-[75vh] max-w-5xl text-center flex flex-col justify-center align-center mx-auto px-4 py-20">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Subconscious learning through chill typing
                </h1>
                <p className="text-gray-400 font-semibold mt-5 max-w-2xl mx-auto">
                    Upload your own texts in library, make groups, start typing and grow
                    smarter without even trying.
                </p>
                <div className="flex flex-wrap items-center gap-3 justify-center mt-10">
                    {!user && (
                        <Button className="px-5" onClick={signInWithGoogle}>
                            <FaGoogle /> One click login / signup
                        </Button>
                    )}
                    {user && (
                        <Button className="py-5 px-10" asChild>
                            <Link to={giveTypingPageRoute("main")}>Enter Typesmart</Link>
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        className="px-5 border-1 border-secondary"
                        asChild
                    >
                        <Link to={giveTypingPageRoute("demo")}>Take Demo</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2 justify-center mt-16">
                    <FaGithub />
                    <p className="text-lg font-semibold">Github Open Sourced</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 flex flex-col gap-20 mt-15">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <img
                        src="/screenshots/feature-pdf.png"
                        alt="Screenshot of adding text with PDF reference"
                        className="w-full rounded-2xl shadow-lg border-1 border-muted-foreground"
                    />
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Add new text with PDF side-by-side
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Easily add new texts into your library while keeping a PDF open
                            alongside for reference. Perfect for typing practice using your
                            favorite study material, books, or research notes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold mb-4">
                            Organize texts into groups with importance
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Create multiple groups of texts, and adjust the importance of each
                            text as <span className="font-semibold">high</span>,{" "}
                            <span className="font-semibold">medium</span>, or{" "}
                            <span className="font-semibold">low</span>. Our smart algorithm
                            makes sure important texts appear more often while typing.
                        </p>
                    </div>
                    <img
                        src="/screenshots/feature-group.png"
                        alt="Screenshot of group and importance management"
                        className="w-full rounded-2xl shadow-lg order-1 md:order-2 border-1 border-muted-foreground"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <img
                        src="/screenshots/feature-typing-interface.png"
                        alt="Screenshot of distraction-free typing interface"
                        className="w-full rounded-2xl shadow-lg border-1 border-muted-foreground"
                    />
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Zero-distraction typing interface
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Enjoy a smooth, minimal, and stress-free typing experience.
                            Our clean interface helps you stay fully focused on your words,
                            making your typing sessions as chill and distraction-free as possible.
                        </p>
                    </div>
                </div>
            </div>


            <div className="bg-card py-5 px-3 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 mt-20">
                <div className="flex items-center gap-2 text-lg font-bold">
                    <span className="flex items-center gap-2">
                        <img
                            className="h-6 aspect-square"
                            src="/logo.png"
                            alt="Typesmart logo image"
                        />{" "}
                        TypeSmart by
                    </span>
                    <Link
                        to="https://www.github.com/abhisarxverma"
                        className="ms-3 flex items-center gap-2 underline"
                    >
                        <img
                            src="/profile.jpg"
                            className="aspect-square rounded-full w-8 inline"
                            alt="profile image of the creator of Typesmart"
                        />{" "}
                        Abhisar verma
                    </Link>
                </div>
                <p className="text-muted-foreground text-md text-center md:text-right">
                    © 2025 Typesmart. All rights reserved.
                </p>
            </div>
        </div>
    );
}
