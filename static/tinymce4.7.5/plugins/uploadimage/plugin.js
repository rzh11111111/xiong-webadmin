tinymce.PluginManager.add('uploadimage', function(editor) {
    function imageHandler(dataList) {
        if (dataList && dataList.length) {
            editor.focus();
            dataList.forEach(item => {
                editor.selection.setContent(editor.dom.createHTML('img', {
                    src: item.url || item.src,
                    style: "max-width:100%;"
                }));
            })
        }
    }

    function selectLocalImages() {
        editor.settings.images_selector(imageHandler);
    }

    editor.addCommand("mceUploadImageEditor", selectLocalImages);

    editor.addButton('uploadimage', {
        icon: 'image',
        tooltip: '上传图片',
        onclick: selectLocalImages
    });

    editor.addMenuItem('uploadimage', {
        icon: 'image',
        text: '上传图片',
        context: 'tools',
        onclick: selectLocalImages
    });
});
