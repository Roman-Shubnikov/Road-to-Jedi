import eruda from 'eruda'
import erudaCode from 'eruda-code'
import erudaDom from 'eruda-dom'

const erudaModule = () => {
  eruda.init()
  eruda.add(erudaCode)
  eruda.add(erudaDom)
  return eruda
}

export default erudaModule