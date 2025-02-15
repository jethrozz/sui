// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { createMessage } from '_messages';
import type { Message } from '_messages';
import { getAllAccounts } from '../accounts';
import { UiConnection } from './UiConnection'; // 导入 UIConnection

export class ExternalConnection {
	static readonly ALLOWED_METHODS = ['getData', 'connect', 'disconnect','signData','getAddress'] as const;
	static readonly CHANNEL = 'external-connection';
	private uiConnection: UiConnection;

	constructor(uiConnection: UiConnection) {
		this.uiConnection = uiConnection;
	}

	public async handleMessage(request: any): Promise<any> {
		console.log('ExternalConnection.handleMessage', request);
		if (!ExternalConnection.ALLOWED_METHODS.includes(request.method)) {
			throw new Error(`不支持的方法: ${request.method}`);
		}

		// 根据方法类型处理请求
		switch (request.method) {
			case 'getAddress':
				return this.handleGetAddress();
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
	private async handleGetAddress(): Promise<any> {
		// 实现获取地址的逻辑
		console.log('ExternalConnection.handleGetAddress');
		const allAccounts = await getAllAccounts();
		console.log('allAccounts', allAccounts);
		console.log('allAccounts address', JSON.stringify(await allAccounts[0].address));
		console.log('allAccounts', JSON.stringify(await allAccounts));
		const accountsWithAddresses = await Promise.all(
			allAccounts.map(async (account) => ({
				address: await account.address, // 等待异步address解析
				id: account.id,
				type: account.type
			}))
		);
		let result = { success: true, data: accountsWithAddresses };
		return JSON.stringify(result);
	}
	private async handleSignData(params: any): Promise<any> {
		//this.uiConnection.send(params);
		
		console.log('ExternalConnection.handleSignData', params);
		await this.uiConnection.handleExternalMessage(params);
		// 实现获取数据的逻辑
		return { success: true, data: {"aa":"1"} };
	}
}
