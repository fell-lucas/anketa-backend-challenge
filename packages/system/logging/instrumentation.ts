/** To Enable DataDog Tracing: */
import tracer from 'dd-trace'

// initialized in a different file to avoid hoisting.
if (process.env.DD_ENABLED === 'true') {
  console.log('🤖 DataDog enabled')
  // initialized in a different file to avoid hoisting.
  tracer.init()
}

export default tracer
