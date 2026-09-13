export const defaultSite = {
  subscribeTitle: 'Stay in the Word',
  subscribeText: 'Get new Bible commentary, devotionals, sermons, and teaching delivered to your inbox.',
  brandName: 'Hall Bible Commentary',
  authorName: 'Aaron Joseph Hall',
  homeTitle: 'Open the Word.\nKeep growing.',
  homeIntroduction: 'Read Scripture. Explore the teaching connected to it. A growing library of commentary, articles, and sermons, with the Bible at the center.',
  homeAbout: 'Hall Bible Commentary brings together the teaching of Aaron Joseph Hall. It is a place to explore Scripture, revisit a sermon, and follow a subject across the Bible.',
  showCommentary: true, showArticles: true, showSermons: true,
  disclosure: 'This commentary is part of a growing walk with the Lord. As Aaron continues to study Scripture, pray, and grow in understanding, these reflections may be clarified, expanded, or revised. Some drafts may be assisted by AI for organization and editing. AI is restricted to Aaron’s sermons, articles, approved commentary, and other first-party material; it does not search or use outside sources. Every AI-assisted draft is reviewed and approved before publication. Read them alongside the Bible, with Scripture as your foundation.',
  primaryLinks: [['Bible','/bible'],['Commentary','/commentary'],['Articles','/articles'],['Devotionals','/devotionals'],['Questions','/questions'],['Topics','/topics'],['People','/people'],['Series','/series'],['Sermons','/sermons']],
  aboutLinks: [['About the library','/about'],['About Aaron','/about/aaron-joseph-hall'],['Speaking requests','/about/speaking'],['Permissions','/about/permissions'],['Frequently asked questions','/about/faq']],
  resourceLinks: [['Books','/resources/books'],['The Ministry Study ↗','https://TheMinistryStudy.com']],
  pages: {} as Record<string,string>,
  books: [] as {title:string;description:string;url:string}[],
};
export type SiteSettings=typeof defaultSite;
