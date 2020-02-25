"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upath2_1 = require("upath2");
function resolvePackage(name, options) {
    let pkgRoot = upath2_1.dirname(require.resolve(`${name}/package.json`, options));
    return {
        name,
        pkgRoot,
        pkg: require(`${pkgRoot}/package.json`),
    };
}
exports.resolvePackage = resolvePackage;
exports.default = resolvePackage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFpQztBQUdqQyxTQUFnQixjQUFjLENBQUMsSUFBWSxFQUFFLE9BQStCO0lBRTNFLElBQUksT0FBTyxHQUFHLGdCQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFeEUsT0FBTztRQUNOLElBQUk7UUFDSixPQUFPO1FBQ1AsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLE9BQU8sZUFBZSxDQUF3QjtLQUM5RCxDQUFBO0FBQ0YsQ0FBQztBQVRELHdDQVNDO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3VwYXRoMic7XG5pbXBvcnQgdHlwZSB7IElQYWNrYWdlSnNvbiB9IGZyb20gJ0B0cy10eXBlL3BhY2thZ2UtZHRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYWNrYWdlKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IHsgcGF0aHM/OiBzdHJpbmdbXTsgfSlcbntcblx0bGV0IHBrZ1Jvb3QgPSBkaXJuYW1lKHJlcXVpcmUucmVzb2x2ZShgJHtuYW1lfS9wYWNrYWdlLmpzb25gLCBvcHRpb25zKSk7XG5cblx0cmV0dXJuIHtcblx0XHRuYW1lLFxuXHRcdHBrZ1Jvb3QsXG5cdFx0cGtnOiByZXF1aXJlKGAke3BrZ1Jvb3R9L3BhY2thZ2UuanNvbmApIGFzIGFueSBhcyBJUGFja2FnZUpzb24sXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVzb2x2ZVBhY2thZ2VcbiJdfQ==