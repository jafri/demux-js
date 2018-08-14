import { Block } from "../../../../index"
import { EosAction } from "./interfaces"

export class NodeosBlock implements Block {
  public actions: EosAction[]
  public actionCount: number
  public blockHash: string
  public blockNumber: number
  public previousBlockHash: string
  public timestamp: Date
  public producer: string

  constructor(rawBlock: any) {
    let actions = this.collectActionsFromBlock(rawBlock)
    this.actions = actions
    this.actionCount = actions.length
    this.blockNumber = rawBlock.block_num
    this.blockHash = rawBlock.id
    this.previousBlockHash = rawBlock.previous
    this.timestamp = new Date(rawBlock.timestamp)
    this.producer = rawBlock.producer
  }

  protected collectActionsFromBlock(rawBlock: any): EosAction[] {
    return this.flattenArray(rawBlock.transactions.map((transaction: any) => {
      if (!transaction.trx.transaction) {
        return [] // Deferred transaction, cannot decode
      }
      return transaction.trx.transaction.actions.map((action: any, actionIndex: number) => {
        // Delete unneeded hex data if we have deserialized data
        if (action.data) {
          delete action.hex_data // eslint-disable-line
        }
        return {
          type: `${action.account}::${action.name}`,
          payload: {
            transactionId: transaction.trx.id,
            actionIndex,
            ...action,
          },
        }
      })
    }))
  }

  private flattenArray(arr: any[]): any[] {
    return arr.reduce((flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten), [])
  }
}
