export const defaultSite = {
  subscribeTitle: 'Stay in the Word',
  subscribeText: 'Get new Bible commentary, devotionals, sermons, and teaching delivered to your inbox.',
  brandName: 'Hall Bible Commentary',
  authorName: 'Aaron Joseph Hall',
  homeTitle: 'Open the Word.\nKeep growing.',
  homeIntroduction: 'Read Scripture. Explore the teaching connected to it. A growing library of commentary, articles, and sermons, with the Bible at the center.',
  homeAbout: 'Hall Bible Commentary brings together the teaching of Aaron Joseph Hall. It is a place to explore Scripture, revisit a sermon, and follow a subject across the Bible.',
  showCommentary: true, showArticles: true, showSermons: true,
  disclosure: 'This commentary is part of a growing walk with the Lord. As Aaron continues to study Scripture, pray, and grow in understanding, these reflections may be clarified, expanded, or revised. Hall Bible Commentary may use AI to help organize sermon manuscripts, articles, and previously approved teaching into readable verse-by-verse drafts. AI does not independently search the internet or draw from outside commentaries, books, or websites. Every AI-assisted draft remains private until Aaron personally reviews, edits, and approves it for publication. When trusted outside commentary, quotations, or other resources are included, they will be clearly identified, attributed to their original source, and linked when possible; that material is not presented as Aaron’s original teaching. Read every reflection alongside the Bible, with Scripture as your foundation.',
  primaryLinks: [['Bible','/bible'],['Commentary','/commentary'],['Articles','/articles'],['Devotionals','/devotionals'],['Questions','/questions'],['Topics','/topics'],['People','/people'],['Series','/series'],['Sermons','/sermons']],
  aboutLinks: [['About the library','/about'],['About Aaron','/about/aaron-joseph-hall'],['Speaking requests','/about/speaking'],['Permissions','/about/permissions'],['Frequently asked questions','/about/faq']],
  resourceLinks: [['Books','/resources/books'],['The Ministry Study ↗','https://TheMinistryStudy.com']],
  pages: {} as Record<string,string>,
  books: [] as {title:string;description:string;url:string}[],
};
export type SiteSettings=typeof defaultSite;
