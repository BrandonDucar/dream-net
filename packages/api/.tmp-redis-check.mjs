import Redis from 'ioredis';
async function test(url){
  const r = new Redis(url, { connectTimeout: 2000, lazyConnect: true, maxRetriesPerRequest: 1 });
  try{ await r.connect(); const pong = await r.ping(); console.log(url,'OK',pong); }
  catch(e){ console.log(url,'FAIL',e.message); }
  finally{ try{ r.disconnect(); }catch{} }
}
await test('redis://nerve:6379');
await test('redis://localhost:6379');
