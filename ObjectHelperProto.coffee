Helper = {}
###
# Проверяем/обрабатываем свойство, не ёбаясь об промежуточные свойства объекта
#
# anything.CheckProperties('object.prop1.prop2.prop3',true, parseInt);
#
# @param ns проверяемая последовательность свойств 'object.prop1.prop2.prop3' || [ 'object','prop1','prop2','prop3' ]
# @param returnValue нужно ли возвращать значение проверяемого свойства
# @param callback свершить над возвращаемым значением коллбек
# @returns {boolean}
# @constructor
###
Object::CheckProperties = ( ns , returnValue, callback ) ->

  pieces = if typeof ns == 'string' then ns.split '.'  else ns 

  checkProp = (aProps, object, returnValue) ->
    prop = aProps.shift()
    hasProp = object.hasOwnProperty prop

    if aProps.length and hasProp
      return checkProp aProps, object[prop], returnValue

    else
      if hasProp
        if returnValue
          if object[prop]
            if callback
              return callback( object[prop] )
            else return object[prop]
          else return null
        else hasProp
      else hasProp


  return checkProp pieces, this, returnValue


###
# Выставляем цепочку свойств и всё так же не ёбаемся об отсутствующие элементы по пути
#
# anything.SetProperties('object.prop1.prop2.prop3', 123)
#
# @param ns выставляемая последовательность свойств 'object.prop1.prop2.prop3' || [ 'object','prop1','prop2','prop3' ]
# @param value понятно
# @constructor
###
Object::SetProperties = (ns, value) ->
  pieces = if (typeof ns is'string') then ns.split '.'  else ns 
  console.log(ns)
  console.log(typeof ns)
  prop = pieces.shift();

  if (pieces.length)

    if !this.hasOwnProperty prop
      this[prop] = new Object();
    this[prop].SetProperties pieces, value

  else
    this[prop] = value;
  return

Helper = {
  SetTest : () ->
    Helper.SetProperties 'theprop.subprop.subsubprop', '123'
  
  Test           : () ->
    return {
      exist   : Helper.CheckProperties 'theprop.subprop.subsubprop'
      value   : Helper.CheckProperties 'theprop.subprop.subsubprop', true
      callback: typeof Helper.CheckProperties 'theprop.subprop.subsubprop', true, parseInt
      notexist: Helper.CheckProperties 'theprop.subprop.subsubprop2', Helper
    }
}

console.log Helper
console.log Helper.SetTest()
console.log Helper.Test()
console.log Helper
