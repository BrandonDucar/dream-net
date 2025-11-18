"""
DreamNet Agent Client - Example Usage
Python example
"""

from dreamnet_agent import DreamNetAgent


def main() -> None:
    agent = DreamNetAgent()  # reads DREAMNET_API_KEY from env

    # Natural language interface
    print("🤖 Using natural language interface...")
    nl = agent.autonomous_query("Show me DreamNet status")
    print("NL response:", nl)

    # Structured calls
    print("\n📊 Getting system status...")
    status = agent.check_system_status()
    print("Status:", status)

    print("\n🚀 Listing Vercel projects...")
    projects = agent.list_vercel_projects()
    print("Vercel projects:", projects)

    print("\n🧹 Analyzing cleanup opportunities...")
    cleanup = agent.analyze_cleanup_opportunities(target_domain="dreamnet.ink")
    print("Cleanup:", cleanup)

    print("\n🛡️ Getting Shield threats...")
    threats = agent.get_shield_threats(limit=10)
    print("Threats:", threats)

    print("\n💭 Querying dreams...")
    dreams = agent.query_dreams(limit=10)
    print("Dreams:", dreams)

    print("\n🐺 Getting Wolf Pack opportunities...")
    opportunities = agent.get_wolf_pack_opportunities(limit=10)
    print("Wolf Pack opportunities:", opportunities)

    print("\n✅ All operations completed!")


if __name__ == "__main__":
    main()







