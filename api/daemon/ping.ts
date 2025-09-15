export default async function handler(_req: any, res: any) {
  return res.status(200).json({
    ok: true,
    message: 'Ping success'
  });
}
