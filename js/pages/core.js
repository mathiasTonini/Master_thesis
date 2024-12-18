const parser = new DOMParser();
const serializer = new XMLSerializer();
const instance = axios.create({
    baseURL: 'http://localhost:8080/exist/restxq/demo',
    withCredentials:true
});

// Front end - Back end communication  

async function backendRequest (url) {
  return instance.get(url).then((resp) => {
      return resp.data;
    });
}

async function backendPostRequest (url,data,redirection= null) {
  return instance.post(url,data,{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((resp) => {
    if (resp.status === 200) {
      console.log(resp);
      console.log(redirection)
      if (redirection != null){
        window.location.href = redirection;
      }
    }
  });
}

async function backendDeleteRequest(url){
  return instance.delete(url).then((resp) => {
    return resp.data;
  });
}

 function getTextOf (node) {
     return node.iterateNext().textContent;
 };
 
 function setHTML (nodes) {
  let n = null;
  let target = '';
  console.log(target)
  while ((n = nodes.iterateNext())) {
    target = target + serializer.serializeToString(n)
  };
  return target;
};

async function getXmlFromBackend (url) {
  const local = await backendRequest(url)
  answer = parser.parseFromString(local, 'text/xml')
  return answer
};

function evaluateXPath(expression,document ,contextNode=document,stringValue= false, onlyOne = false) { 
  const xpathResult = document.evaluate(
    expression,
    contextNode,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );
  const nodes = [];
  var node = xpathResult.iterateNext();
  while (node) {
    if(stringValue){
      node = node.textContent;
    }
    if(onlyOne){
      return node;
    }
    nodes.push(node);
    node = xpathResult.iterateNext();
  }
  return nodes;
}

function objectToXml(obj, doc = document.implementation.createDocument('', '', null)) {
  function createElement(name, value) {
    // If we don't give a key for the first element
    const sanitizedName = /^[a-zA-Z_]/.test(name) ?  name.replace(/_\$\d+\$/, '') : `tag_${name}`;
    const element = doc.createElement(sanitizedName);

    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([key, val]) =>
        element.appendChild(createElement(key, val))
      );
    } else if (Array.isArray(value)) {
      value.forEach(val => {
        if (typeof val === 'object' && !Array.isArray(val)) {
          const keys = Object.keys(val);
          if (keys.length === 1) {
            const childName = keys[0];
            element.appendChild(createElement(childName, val[childName]));
          } else {
            element.appendChild(createElement(name, val));
          }
        } else {
          element.appendChild(createElement(name, val));
        }
      });
    } else {
      element.textContent = value;
    }
    return element;
  }

  Object.entries(obj).forEach(([key, value]) =>
    doc.appendChild(createElement(key, value))
  );

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
