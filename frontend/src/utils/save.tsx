
<Tabs defaultValue="pdf" className="flex-1">
    <TabsList className="">
        <TabsTrigger value="pdf">PDF</TabsTrigger>
        <TabsTrigger value="txt">Txt File</TabsTrigger>
        <TabsTrigger value="direct">Direct</TabsTrigger>
    </TabsList>
    <TabsContent className="h-full" value="pdf">
        <PdfUploader text={text} textSettingFn={setText} />
    </TabsContent>
    <TabsContent value="txt">
    </TabsContent>
    <TabsContent value="direct">
    </TabsContent>
</Tabs>