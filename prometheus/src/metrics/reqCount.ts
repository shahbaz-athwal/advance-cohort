import { NextFunction, Request, Response } from "express";
import client from "prom-client";
import { activeRequestsGauge } from "./activeReq";
import { httpRequestDurationMicroseconds } from "./histogram";

const counter = new client.Counter({
    name: 'http_req_total',
    help: 'Total number of HTTP reqs',
    labelNames: ['method', 'route', 'status_code']
})

export const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();
    
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`Request took ${endTime - startTime}ms`);

        counter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);

        activeRequestsGauge.dec();
    });

    next();
};