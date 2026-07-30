export default function exit() {
    process.stdout.write("\x1Bc");
    process.exit(0);
}
