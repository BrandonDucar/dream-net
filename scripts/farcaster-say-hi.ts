import dotenv from 'dotenv';
dotenv.config();

const signers = {
    'ghostmintops': {
        uuid: process.env.GHOSTMINTOPS_SIGNER_UUID,
        apiKey: process.env.NEYNAR_API_KEY
    },
    'neyclaw': {
        uuid: process.env.NEYCLAW_SIGNER_UUID,
        apiKey: process.env.EXTRA_API_KEY
    }
};

async function sayHi(signerName: string, targetUsername: string) {
    const signer = signers[signerName as keyof typeof signers];
    
    if (!signer || !signer.uuid || !signer.apiKey) {
        console.error(`❌ Signer ${signerName} not properly configured in .env`);
        return;
    }

    console.log(`🚀 [${signerName}] Socializing with @${targetUsername}...`);

    try {
        // 1. Get Target Info
        const userRes = await fetch(`https://api.neynar.com/v2/farcaster/user/by_username?username=${targetUsername}`, {
            headers: { 'x-api-key': signer.apiKey }
        });
        const userData: any = await userRes.json();
        const fid = userData.user.fid;

        // 2. Say Hi (Cast)
        const message = `Hi @${targetUsername}! @${signerName} here from the DreamNet swarm. We are plugging into the sensory spikes now. 📡🧠 #AgentSwarm`;
        
        const castRes = await fetch('https://api.neynar.com/v2/farcaster/cast', {
            method: 'POST',
            headers: { 
                'x-api-key': signer.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                signer_uuid: signer.uuid,
                text: message
            })
        });

        if (castRes.ok) {
            console.log(`✅ Success! Message sent to @${targetUsername}`);
        } else {
            const err: any = await castRes.json();
            console.log(`❌ Failed to cast: ${err.message}`);
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

const signerArg = process.argv[2] || 'neyclaw';
const targetArg = process.argv[3] || 'suchbot';

sayHi(signerArg, targetArg);
