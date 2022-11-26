module.exports = app => {
    const routeController = app.controllers.uploadFile;

    app.route('/api/sendFile')
    .post(routeController.uploadFile);

    app.route('/api/getFilesList')
    .get(routeController.getFileList);
}