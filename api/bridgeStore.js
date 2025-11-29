const { v4: uuid } = require('uuid')

const jobs = new Map()

function createQuote(payload, quoteData) {
  const id = uuid()
  const q = {
    id,
    ...payload,
    ...quoteData,
    status: 'quoted',
    createdAt: Date.now()
  }
  jobs.set(id, q)
  return q
}

function createJobFromQuote(payload, quoteId) {
  const id = uuid()
  const job = {
    id,
    quoteId: quoteId || null,
    ...payload,
    status: 'pending',
    sourceTxHash: null,
    destTxHash: null,
    errorMessage: null,
    createdAt: Date.now()
  }
  jobs.set(id, job)
  return job
}

function getJob(id) {
  return jobs.get(id) || null
}

module.exports = {
  createQuote,
  createJobFromQuote,
  getJob
}