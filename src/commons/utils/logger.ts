interface ILoggerPropos {
    error: Error | string;
    module?: string;
    request?: Request;
}

export const logger = ({ error, module, request }: ILoggerPropos) => {
    console.log ("🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛");
    console.log ("Error: ", error);
    console.log(module);
    console.log(request);
    console.log ("🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛");

};