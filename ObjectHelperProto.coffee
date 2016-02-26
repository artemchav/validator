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
  prop = pieces.shift();

  if (pieces.length)

    if !this.hasOwnProperty prop
      this[prop] = new Object();
    this[prop].SetProperties pieces, value

  else
    this[prop] = value;
  return

#######################################
# Tests
#######################################
Tests = {
  SetTest : () ->
    Tests.SetProperties 'theprop.subprop.subsubprop', '123'
    Tests.SetProperties 'theprop.subprop.null'


  Test           : () ->
    return {
      exist   : Tests.CheckProperties 'theprop.subprop.subsubprop' # true
      value   : Tests.CheckProperties 'theprop.subprop.subsubprop', true # "123"
      nilvalue: Tests.CheckProperties 'theprop.subprop.null', true # null
      valuestandart : Helper.CheckProperties 'theprop.subprop.subsubprop.length' # true
      valuelength   : Helper.CheckProperties 'theprop.subprop.subsubprop.length', true # 3
      callback: typeof Tests.CheckProperties 'theprop.subprop.subsubprop', true, parseInt # "number"
      notexist: Tests.CheckProperties 'theprop.subprop.subsubprop2', Tests # false
    }
}

console.log Tests
console.log Tests.SetTest()
console.log Tests.Test()
console.log Tests
