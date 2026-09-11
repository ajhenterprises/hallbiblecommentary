// Request identity is server-local. A client JSON field cannot create this capability.
const approved=new WeakSet<Request>();
export function approveRequest(request:Request){approved.add(request);return request}
export function consumeApproval(request:Request){const allowed=approved.has(request);approved.delete(request);return allowed}
