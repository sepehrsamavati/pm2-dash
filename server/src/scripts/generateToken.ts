import { signToken } from "../utils/jwt";

const lastArg = process.argv.pop();

if (typeof lastArg !== "string") {
    console.warn("⚠ Invalid argument?!");
    process.exit(0);
}

try {
    const token = signToken(lastArg);
    console.log(`✅ Token generated successfully\n"${token}"`);
} catch (err) {
    console.log("❌ Token generation failed!\n");
    console.error(err);
}
