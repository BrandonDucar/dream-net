import { dreamNetOS } from "../server/core/dreamnet-os";

const agent = process.argv[2] || "dreamkeeper";
const input = process.argv[3] || "list";

(async () => {
  const res = await dreamNetOS.runAgent({ agent, input, userId: "cli" });
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(res, null, 2));
})();


