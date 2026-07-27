export interface AuthorizationCodeResult {
    code: string;
    stop: () => void;
}

export function waitForAuthorizationCode(): Promise<AuthorizationCodeResult> {
    return new Promise((resolve, reject) => {
        const server = Bun.serve({
            port: 8765,

            fetch(req) {
                const url = new URL(req.url);

                if (url.pathname !== '/callback') {
                    return new Response('Not Found', { status: 404 });
                }

                const error = url.searchParams.get('error');
                if (error) {
                    reject(new Error(`Authentication failed: ${error}`));

                    return new Response(
                        `
                            <html>
                            <body>
                                <h2>Authentication failed</h2>
                                <p>You may close this window.</p>
                            </body>
                            </html>
                        `,
                        {
                            headers: {
                                'Content-Type': 'text/html',
                            },
                        },
                    );
                }

                const code = url.searchParams.get('code');

                if (!code) {
                    return new Response('Missing authorization code', {
                        status: 400,
                    });
                }

                resolve({
                    code,
                    stop: () => server.stop(),
                });

                return new Response(
                    `
                        <html>
                            <body>
                            <h2>Login successful</h2>
                            <p>You may now close this window.</p>
                            </body>
                        </html>
                    `,
                    {
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    },
                );
            },

            error(error) {
                reject(error);

                return new Response('Internal Server Error', {
                    status: 500,
                });
            },
        });
    });
}
