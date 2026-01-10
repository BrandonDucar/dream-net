# Quick Email Guide - Send Emails Directly

## 🚀 Two Ways to Send Emails

### Option 1: Direct Send (Immediate)
Send an email right now to anyone:

```bash
pnpm exec tsx scripts/sendEmailDirectly.ts <email> <name> <subject> <message>
```

**Example:**
```bash
pnpm exec tsx scripts/sendEmailDirectly.ts investor@vc.com "John Doe" "Partnership Opportunity" "Hi John, I'd like to discuss a potential partnership with DreamNet..."
```

### Option 2: Add Lead (Automatic)
Add a lead and let the system score it and send automatically:

```bash
pnpm exec tsx scripts/seedWolfpackTestLead.ts
```

Then the background service will:
1. Score the lead
2. Generate email draft
3. Queue it
4. Send it automatically

## 📧 Background Service

The funding service is now running in the background! It will:
- ✅ Score leads every 30 minutes
- ✅ Generate email drafts for qualified leads
- ✅ Send pending emails automatically
- ✅ Respect safety limits (50/day, 10/cycle)

## 🎯 Quick Commands

### Send Email Directly
```bash
pnpm exec tsx scripts/sendEmailDirectly.ts email@example.com "Name" "Subject" "Your message here"
```

### Add a Lead
```bash
# Edit scripts/seedWolfpackTestLead.ts or use WolfPackFundingCore.upsertLead()
```

### Check Status
```bash
pnpm exec tsx scripts/checkWolfpackEmailStatus.ts
```

### Run Full Test
```bash
pnpm wolfpack:test
```

## 📝 Example: Send to a VC

```bash
pnpm exec tsx scripts/sendEmailDirectly.ts \
  partner@a16z.com \
  "a16z Crypto" \
  "DreamNet: A living digital network on Base" \
  "Hi team, I'm building DreamNet - a living digital network on Base that connects dreams, agents, and economic systems. I'd love to discuss how this could align with your portfolio..."
```

## ⚡ That's It!

You can now send emails directly to anyone, or add leads and let the system handle it automatically!

