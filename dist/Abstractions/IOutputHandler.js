export function newOutputHandler() {
    let a = {
        outError: function (msg) {
            console.error(msg);
        },
        outLog: function (msg) {
            console.log(msg);
        }
    };
    return a;
}
