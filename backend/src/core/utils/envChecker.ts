export function checkEnvVariables(...requiredEnvVariables: string[]) {
    requiredEnvVariables.forEach((variable) => {
        if (!process.env[variable]) {
            console.error(`Error: Missing required environment variable: '${variable}'`);
            process.exit(1);
        }
    });
}