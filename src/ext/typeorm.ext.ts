/**
 * Typeorm 保证可测试性
 */
import { Transaction, TransactionManager } from 'typeorm';
import { isTestEnv } from '@util/appUtil';

export function XTransaction(connectionOrOptions?) {
    let result = null
    if (!isTestEnv()) {
        result = Transaction(connectionOrOptions)
    }
    return function (target, methodName, descriptor) {
        if (!isTestEnv()) {
            result(target, methodName, descriptor)
        }
    }
}

export function XTransactionManager() {
    let result = null
    if (!isTestEnv()) {
        result = TransactionManager()
    }
    return function (object, methodName, index) {
        if (!isTestEnv()) {
            result(object, methodName, index)
        }
    }
}
