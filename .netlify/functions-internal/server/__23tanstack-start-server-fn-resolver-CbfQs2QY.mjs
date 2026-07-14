//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CbfQs2QY.js
var manifest = { "515cc8d5c1202eeecf2d74757e16bcf1d38bf8b1262aeb3b844f63653c9b5503": {
	functionName: "chatWithAi_createServerFn_handler",
	importer: () => import("./_ssr/chat-server-B_czSVh9.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
