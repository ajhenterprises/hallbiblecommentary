// Delivery adapters must use this internal record as the source of truth.
export type SubscriberStatus='active'|'pending'|'unsubscribed'|'bounced'|'complained'|'suppressed';
export type SubscriberSyncRecord={id:string;email:string;firstName:string;status:SubscriberStatus;tags:string[];consentAt:string};
export interface EmailProvider {name:string;syncSubscriber(record:SubscriberSyncRecord):Promise<{externalId:string}>;suppressSubscriber(externalId:string):Promise<void>;verifyWebhook(rawBody:string,signature:string):Promise<boolean>}
export const canSend=(record:SubscriberSyncRecord)=>record.status==='active'&&!!record.consentAt;
// None is intentional: collection works without credentials or a delivery provider.
export function emailProvider():EmailProvider|null{return null}
// Future adapters must verify webhook signatures and preserve suppression locally.
// Store secrets only in server environment variables, never SiteSettings.
