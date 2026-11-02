export const handler = {
    handle(_request) {
        return {
            status: 200,
            headers: [
                {
                    name: 'content-type',
                    value: 'application/json',
                },
            ],
            body: JSON.stringify({
                message: 'Hello from {{project-name}}',
            }),
        };
    },
};
