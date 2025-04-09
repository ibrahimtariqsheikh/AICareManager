"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"
// Import motion components at the top of the file
import { motion } from "framer-motion"

interface AIImproveDialogProps {
    report: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AIImproveDialog({ report, open, onOpenChange }: AIImproveDialogProps) {
    const [originalText] = useState(report.notes || "")
    const [improvedText, setImprovedText] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState("original")

    const handleImprove = () => {
        setIsGenerating(true)

        // Simulate AI processing
        setTimeout(() => {
            // Example of AI-improved text
            const improved =
                originalText === "Yo, what's up? Everything is good"
                    ? "The client was in good spirits during today's visit. All care tasks were completed successfully and the client's needs were met appropriately."
                    : originalText === "Mum gave breakfast. They had cereal"
                        ? "The client's mother prepared breakfast for them. The meal consisted of cereal, which the client consumed without any issues."
                        : "The client was in good condition during today's visit. All scheduled tasks were completed successfully. The client expressed satisfaction with the care provided and did not report any new concerns or discomfort."

            setImprovedText(improved)
            setIsGenerating(false)
            setActiveTab("improved")
        }, 1500)
    }

    const handleAccept = () => {
        toast.success("Improved text accepted and saved")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        AI Report Improvement
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        Our AI can help improve the wording and professionalism of care worker reports. This is especially useful
                        for ensuring reports meet compliance standards and are clear for all stakeholders.
                    </p>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="original">Original Text</TabsTrigger>
                            <TabsTrigger value="improved">Improved Text</TabsTrigger>
                        </TabsList>

                        <TabsContent value="original" className="space-y-4 pt-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="original-text">Original Report Text</Label>
                                <Textarea id="original-text" value={originalText} readOnly className="min-h-[200px]" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button onClick={handleImprove} disabled={isGenerating} className="w-full">
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Improving Text...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Improve with AI
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="improved" className="space-y-4 pt-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="improved-text">AI-Improved Text</Label>
                                <Textarea
                                    id="improved-text"
                                    value={improvedText}
                                    onChange={(e) => setImprovedText(e.target.value)}
                                    className="min-h-[200px]"
                                    placeholder={isGenerating ? "Generating improved text..." : "AI will generate improved text here"}
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button onClick={handleAccept} disabled={!improvedText} className="w-full">
                                    <Check className="h-4 w-4 mr-2" />
                                    Accept Improved Text
                                </Button>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
