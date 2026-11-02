export const handler = {
    handle(request) {
        const requestId = headerValue(request.headers, 'x-request-id');
        switch (request.method) {
            case 'GET':
                return listItems(request, requestId);
            case 'POST':
                return createItem(request, requestId);
            case 'PUT':
                return updateItem(request, requestId);
            case 'DELETE':
                return deleteItem(request, requestId);
            default:
                return failure('bad-request', `method ${request.method} is not supported`);
        }
    },
};

function listItems(request, requestId) {
    const name = queryParam(request.query, 'name');
    let items = ['notebook', 'pencil'];
    if (name !== null) {
        if (!items.includes(name)) {
            return failure('not-found', `item ${name} was not found`);
        }
        items = [name];
    }
    return respond(200, requestId, {
        function: '{{project-name}}',
        language: 'javascript',
        method: request.method,
        path: request.path,
        query: request.query ?? null,
        requestId,
        items: items.map((item) => ({ name: item })),
    });
}

function createItem(request, requestId) {
    const name = jsonStringField(request.body, 'name');
    if (name === null) {
        return failure('bad-request', 'body must be a JSON object with a string name');
    }
    return respond(201, requestId, {
        function: '{{project-name}}',
        language: 'javascript',
        method: request.method,
        path: request.path,
        query: request.query ?? null,
        requestId,
        created: { name },
    });
}

function updateItem(request, requestId) {
    const id = queryParam(request.query, 'id');
    if (id === null) {
        return failure('bad-request', 'query parameter id is required');
    }
    let body;
    try {
        body = JSON.parse(request.body);
    } catch {
        return failure('bad-request', 'body must be a JSON object');
    }
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return failure('bad-request', 'body must be a JSON object');
    }
    return respond(200, requestId, {
        function: '{{project-name}}',
        language: 'javascript',
        method: request.method,
        path: request.path,
        query: request.query ?? null,
        requestId,
        updated: { id, body },
    });
}

function deleteItem(request, requestId) {
    const id = queryParam(request.query, 'id');
    if (id === null) {
        return failure('bad-request', 'query parameter id is required');
    }
    return respond(200, requestId, {
        function: '{{project-name}}',
        language: 'javascript',
        method: request.method,
        path: request.path,
        query: request.query ?? null,
        requestId,
        deleted: id,
    });
}

function respond(status, requestId, payload) {
    const headers = [{ name: 'content-type', value: 'application/json' }];
    if (requestId !== null) {
        headers.push({ name: 'x-request-id', value: requestId });
    }
    return {
        status,
        headers,
        body: JSON.stringify(payload),
    };
}

function failure(code, message) {
    return { tag: 'err', val: { code, message } };
}

function headerValue(headers, name) {
    const header = headers.find((item) => item.name.toLowerCase() === name);
    return header ? header.value : null;
}

function queryParam(query, key) {
    if (query === null || query === undefined || query === '') {
        return null;
    }
    for (const part of query.split('&')) {
        const separator = part.indexOf('=');
        if (separator === -1) {
            continue;
        }
        if (part.slice(0, separator) === key) {
            return part.slice(separator + 1);
        }
    }
    return null;
}

function jsonStringField(body, field) {
    try {
        const payload = JSON.parse(body);
        const value = payload?.[field];
        return typeof value === 'string' && value !== '' ? value : null;
    } catch {
        return null;
    }
}
