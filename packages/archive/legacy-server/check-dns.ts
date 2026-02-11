import dns from 'dns';
const domains = ['google.com', 'solana.com', 'jup.ag', 'quote-api.jup.ag'];

dns.setServers(['8.8.8.8']);

for (const domain of domains) {
    dns.resolve(domain, (err, addresses) => {
        if (err) {
            console.log(`❌ ${domain}: FAILED (${err.message})`);
        } else {
            console.log(`✅ ${domain}: ${addresses.join(', ')}`);
        }
    });
}
