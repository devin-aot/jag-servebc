
removeFile = (req, res) => {
    // Do not allow users to delete file, just return an "ok".
    const fileId = req.params.fileId;
    res.status(200).json({"fileId": fileId});
}
getFile = (req, res) => {
    const fileId = req.params.fileId;
    res.status(200).json({"fileId": fileId});
}
uploadFile = (req, res) => {

    res.status(201).json({
        "status": "Ok",
        "url": "http://"+req.headers.host+"/api/v1/files/12243252.txt"
    });
};
module.exports = {
    uploadFile,
    getFile,
    removeFile
}