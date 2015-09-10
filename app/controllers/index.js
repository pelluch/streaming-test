
$.index.open();


function showStream(e) {
    Alloy.createController('stream').getView().open({
        theme: "Theme.NoActionBar"
    });
}
