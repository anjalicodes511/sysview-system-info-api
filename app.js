const { error } = require('console');
const http = require('http');
const os = require('os');
const process = require('process');
const url = require('url');

//! Format bytes to human readable format
function formatBytes(bytes, decimal=2){
    if(bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['Bytes','KB','MG','GB','TB','PB'];
    // Math.log()->Logarithm
    const i = Math.floor(Math.log(bytes)/Math.log(k));

    return parseFloat((bytes/Math.pow(k,i))).toFixed(decimal)+' '+sizes[i];
};
//!  Format seconds to human readable time
function formatTime(seconds){
    const days = Math.floor(seconds/(3600*24));
    const hours = Math.floor((seconds%(3600*24))/3600);
    const minutes = Math.floor((seconds%3600)/60);
    const second = Math.floor(seconds%60);

    return `${days}d ${hours}h ${minutes}m ${second}s`;
};


//! Get cpu info
const getCpuInfo = ()=>{
    const model = os.cpus()[0].model;
    const cores = os.cpus().length;
    const architecture = os.arch();
    const loadAvg = os.loadavg();

    return {
        model,
        cores,
        architecture,
        loadAvg
    }

};
//console.log(getCpuInfo());


//! Get memory info
const getMemoryInfo = ()=>{
    const total = formatBytes(os.totalmem());
    const free = formatBytes(os.freemem());
    const usage = ((1-os.freemem()/os.totalmem())*100).toFixed(2)+'%' ;
    
    return {
        total,
        free,
        usage
    };
};
// getMemoryInfo();


//! Get os info
const getOsInfo = ()=>{
    const platform = os.platform();
    const type = os.type();
    const release = os.release();
    const hostName = os.hostname();
    const uptime = formatTime(os.uptime());

    return {
        platform,
        type,
        release,
        hostName,
        uptime
    };
};
// console.log(getOsInfo());


//! Get user info
const getUserInfo = ()=>{
    const user = os.userInfo();
    return user;
};
// console.log(getUserInfo());


//! Get network info
const getNetworkInfo = ()=>{
    const network = os.networkInterfaces();
    return network;
};
// console.log(getNetworkInfo());


//! Get process
const getProcessInfo = ()=>{
    const pid = process.pid;
    const title = process.title;
    const nodeVersion = process.version;
    const uptime = formatTime(process.uptime());
    const cwd = process.cwd();
    const memoryUsage = {
        rss: formatBytes(process.memoryUsage().rss),
        heapTotal: formatBytes(process.memoryUsage().heapTotal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed),
        external: formatBytes(process.memoryUsage().external)
    };
    const env = {
        NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    return {
        pid,
        title,
        nodeVersion,
        uptime,
        cwd,
        memoryUsage,
        env
    };
};
// console.log(getProcessInfo());


//! HTTP SERVER   
const server = http.createServer((req,res)=>{
    const parsedUrl = url.parse(req.url,true);
    res.setHeader('Content-Type','application/json');
    if(parsedUrl.pathname === '/'){
        res.statusCode = 200;
        res.end(JSON.stringify({
            name:'SysView-System Info API',
            description: "Access System Stats Via Simple JSON Routes",
            routes: ["/cpu","/memory","/user","/process","/network","/os"]
        }))
    }
    else if(parsedUrl.pathname === '/cpu'){
        res.statusCode = 200;
        res.end(JSON.stringify(getCpuInfo(), null, 2));
    }
    else if(parsedUrl.pathname === '/memory'){
        res.statusCode = 200;
        res.end(JSON.stringify(getMemoryInfo(), null, 2));
    }
    else if(parsedUrl.pathname === '/user'){
        res.statusCode = 200;
        res.end(JSON.stringify(getUserInfo(), null, 2));
    }
    else if(parsedUrl.pathname === '/process'){
        res.statusCode = 200;
        res.end(JSON.stringify(getProcessInfo(), null, 2));
    }
    else if(parsedUrl.pathname === '/network'){
        res.statusCode = 200;
        res.end(JSON.stringify(getNetworkInfo(), null, 2));
    }
    else if(parsedUrl.pathname === '/os'){
        res.statusCode = 200;
        res.end(JSON.stringify(getOsInfo(), null, 2));
    }
    else{
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: "Route Not Found"
        }));
    }
});
//! Start the server
const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
  console.log(`SysView is running on port ${PORT}`);
});
