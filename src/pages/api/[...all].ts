import {NextRequest} from "next/server";
import libCookie from "cookie";
import setCookie from "set-cookie-parser";
import urlJoin from "url-join";
import {apiUrl} from "@common/config";

export const config = {
    runtime: "edge"
};

export default async (request: NextRequest) => {
    const {method} = request;
    const headers: Record<string, string> = {
        Cookie: request.headers.get("Cookie") ?? "",
        "Content-Type": request.headers.get("Content-Type") ?? ""
    };
    const body = method !== "GET" && method !== "HEAD" ? await request.text() : undefined;
    const requestUrl: string = urlJoin(
        apiUrl,
        "system",
        request.nextUrl.pathname,
        request.nextUrl.search
    );
    const response: Response = await fetch(requestUrl, {
        method,
        body,
        headers
    });

    const setCookieHeader: string = response.headers.get("Set-Cookie") ?? "";
    const cookies = setCookie.parse(setCookie.splitCookiesString(setCookieHeader));
    for (const cookie of cookies) {
        delete cookie.domain;
    }
    response.headers.delete("Set-Cookie");
    for (const cookie of cookies) {
        response.headers.append(
            "Set-Cookie",
            libCookie.serialize(cookie.name, cookie.value, cookie as any) // eslint-disable-line
        );
    }

    return response;
};
