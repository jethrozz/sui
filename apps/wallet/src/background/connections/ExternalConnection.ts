// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { UIConnection } from './UIConnection'; // 导入 UIConnection

export class ExternalConnection {
	static readonly ALLOWED_METHODS = ['getData', 'connect', 'disconnect'] as const;
	static readonly CHANNEL = 'external-connection';

	constructor() {}

	public async handleMessage(request: any): Promise<any> {
		console.log('ExternalConnection.handleMessage', request);
		if (!ExternalConnection.ALLOWED_METHODS.includes(request.method)) {
			throw new Error(`不支持的方法: ${request.method}`);
		}

		// 根据方法类型处理请求
		switch (request.method) {
			case 'signData':
				return this.handleSignData(request.params);
			case 'getData':
				return this.handleGetData(request.params);
			case 'connect':
				return this.handleConnect(request.params);
			case 'disconnect':
				return this.handleDisconnect();
			default:
				throw new Error(`未实现的方法: ${request.method}`);
		}
	}

	private async handleGetData(params: any): Promise<any> {
		// 实现获取数据的逻辑
		return { success: true, data: {} };
	}

	private async handleConnect(params: any): Promise<any> {
		// 实现连接逻辑
		return { success: true, message: '连接成功' };
	}

	private async handleDisconnect(): Promise<any> {
		// 实现断开连接的逻辑
		return { success: true, message: '断开连接' };
	}
	private async handleSignData(params: any): Promise<any> {
		UIConnection.handleMessage(params);
		// 实现获取数据的逻辑
		return { success: true, data: {} };
	}
}
