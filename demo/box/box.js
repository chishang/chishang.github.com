/**
 * @author chishang.lcw
 */
KISSY.ready(function (S) {
    var box = S.all("div");
    S.all(".J_Overflow").on("click", function (e) {

        box.css({
            "overflow": "hidden"
        });
    });

    var versel = S.one(".J_AlignSel"),
        verBox = S.one(".J_AlignBox"),
        verEl = verBox.all(".verel");

    versel && versel.on("change", function (e) {
        var val = versel.val();
        verEl.css({
            "vertical-align": val
        });
    })

});
