!function ($) {

    window.error = window.error || [];

    try {
    
        MyShinyBicycleJS = {
        
            Validator : function(selector, events, __parent, name){
                var Statuses = {
                    NEW : 'New',
                    STARTED : 'Started',
                    READY_TO_TEST : 'Ready',
                    NOT_READY: 'Not ready',
                    WAITING_CHILDS : 'Waiting for childs',
                    PROCESSING : 'Processing',
                    SUCCESS : 'Success',
                    FAIL : 'Fail',
                    DONE : 'Done',
                    STOPPED: 'Stopped'
                };

                this.name = name ? name : null;
                this.statuses = Statuses;

                /**
                 * Стартовое состояние валидатора
                 * @type {string}
                 */
                var Status = Statuses.NEW,

                    /**
                     * Ссылка на этот валидатор
                     * @type {MyShinyBicycleJS.Validator}
                     */
                    Exemplar = this,

                    /**
                     * Успешность валидации
                     * @type {boolean}
                     */
                    Success = false,

                    /**
                     * Строка-селектор для JQuery
                     * @type {string}
                     */
                    Element = selector,

                    /**
                     * Объект JQuery
                     * @type {JQuery object}
                     */
                    Selector = $(selector),

                    /**
                     * Ссылка на родительский валидатор
                     * @type {MyShinyBicycleJS.Validator}
                     */
                    Parent = __parent,

                    /**
                     * Объект, содержащий дочерние валидаторы
                     * в формате {string} name : {MyShinyBicycleJS.Validator} Object
                     * @type {Object}
                     */
                    Validators = {},

                    /**
                     * Объект, хранящий зависимости дочерних валидаторов друг от друга
                     *  {string} name : {array}                      *
                     * @type {{Object}}
                     */
                    Dependencies = {},

                    /**
                     * Сообщение валидатора
                     * @type {string}
                     */
                    Message = '',

                    /**
                     * Флаг, подтверждающий, что нужно валидироваться
                     */
                    Submit,

                    /**
                     * Хранилище данных
                     */
                    Data,

                    /**
                     * Область вывода сообщений (строка-селектор для JQuery)
                     * {string}
                     */
                    MessageArea,

                    /**
                     * Последнее проверенное значение
                     * Для избежания дублирующихся проверок и
                     * дополнительной проверки успешного статуса
                     * {*}
                     */
                    LastValue;

                /**
                 * Дефолтное событие. Именно на него вешаем Submit = true,
                 * чтобы только при нем выполнялась полная самовалидация.
                 * иначе дети будут буянить каждый раз при алертах и запускать полную проверку.
                 * чтобы этого не было, навешано дефолтное событие на FAIL в самом низу
                 */
                $(Element).unbind().bind(events, function(e){
                    e.stopPropagation();
                    Exemplar.Submit();
                    if(Parent){
                        Parent.UnSubmit();
                    }
                    Exemplar.Validate();
                });

                /**
                 * чтобы меньше менять
                 */
                this.SetData = function(data){
                    Data = data;
                };

                this.GetData = function(){
                    return Data;
                };

                this.GetSelector = function(){
                    return Selector;
                };

                /**
                 * Флаг, указывающий, проверяться ли,
                 * когда ответят дочерние валидаторы
                 */
                this.Submit = function(){
                    Submit = true;
                };

                this.UnSubmit = function(){
                    $(Exemplar).trigger(Statuses.STOPPED);
                    Submit = false;
                };

                this.IsSubmit = function(){
                    return Submit;
                };

                this.IsChanged = function(){
                    return this.Value() !==  LastValue;
                }

                /**
                 * Биндим на событие очередной коллбек
                 */
                this.AttachEvent = function(event, callback){
                    $(Exemplar).bind(event, callback);
                };

                this.Init = function(){

                };

                /**
                 * Изменить статус, вызвать навешанные на этот через AttachEvent статус коллбеки
                 */
                this.SetStatus = function(newstatus){
                    if( Status !== newstatus ){
                        Status = newstatus;
                        $(Exemplar).trigger(Status);
                    }
                };

                /**
                 * Текущий статус валидатора
                 */
                this.GetStatus = function(){
                    return Status;
                };

                this.SetMessage = function(msg){
                    Message = msg;
                };

                this.GetMessage = function(){
                    return Message;
                };

                this.SetMessageArea = function(area){
                    MessageArea = area;
                };

                this.GetMessageArea = function(){
                    return MessageArea;
                };

                this.ShowMessage = function(){
                    $(MessageArea).html(Message);
                };

                this.GetElement = function(){
                    return Element;
                };

                /**
                 * ну вот как бы да
                 */
                this.Value = function(){
                    return $(Element).val();
                };

                /**
                 * Создать дочерний валидатор и пихнуть его в Validators                 *
                 * @param name
                 * @param element
                 * @param events
                 * @returns {MyShinyBicycleJS.Validator}
                 * @constructor
                 */
                this.AddValidator = function(name, element, events){
                    var newValidator = new MyShinyBicycleJS.Validator(element , events, Exemplar, name);
                    Validators[name] = newValidator;
                    return newValidator;
                };

                /**
                 * Зависимости между дочерними валидаторами
                 * задается имя валидатора из функции выше и имя зависимого
                 * оттуда же (может быть несколько зависимых полей)
                 * @param main
                 * @param dependent
                 * @constructor
                 */
                this.AddDependency = function( main , dependent ){
                    if(!Dependencies.hasOwnProperty(main)) Dependencies[main] = [];
                    Dependencies[main].push( dependent );
                };

                this.GetDependencies = function(){
                    return Dependencies;
                };

                this.GetValidators = function(){
                    return Validators;
                };

                this.GetLastValue = function(){
                    return LastValue;
                };

                this.GetSuccess = function(){
                    return Success;
                };


                this.CheckReady = function(){

                    for (var n in Validators){
                        if(Validators[n].GetSuccess() === false || Validators[n].IsChanged()){
                           return false;
                        }
                    }

                    Exemplar.SetStatus(Statuses.READY_TO_TEST);
                    return true;

                };

                /**
                 * проверить всех детишек, если все ок - провериться.
                 * Нет - умереть с нужным статусом и сказать об этом папе (дефолтные события ниже)
                 * {boolean} force - параметр, необходимый для безусловной валидации (при зависимостях)
                 */
                this.Validate = function( force , withoutchilds ){
                    if ( this.IsChanged() || !Parent || force){

                        if(Parent) Parent.UnSubmit();

                        this.SetStatus(Statuses.STARTED);

                        var allright = true;

                        if ( !withoutchilds ){

                            for (var n in Validators){

                                switch(Validators[n].GetStatus()){

                                    case Statuses.PROCESSING:
                                    case Statuses.WAITING_CHILDS:

                                        this.SetStatus(Statuses.WAITING_CHILDS);
                                        allright = false;

                                        break;

                                    case Statuses.NEW:

                                        Validators[n].Submit();
                                        Validators[n].Validate();
                                        allright = false;
                                        this.SetStatus(Statuses.WAITING_CHILDS);

                                        break;

                                    case Statuses.FAIL:

                                        this.SetStatus(Statuses.FAIL);
                                        allright = false;
                                        return false;

                                        break;

                                    case Statuses.SUCCESS:

                                        if(Validators[n].IsChanged()){

                                            this.SetStatus(Statuses.FAIL);
                                            allright = false;
                                        }

                                        break;
                                }
                            }
                        }

                        if(allright && ( Submit || withoutchilds )){
                            this.SetStatus(Statuses.PROCESSING);
                        }

                    }
                };

                /**
                 * 1. Пинаем братишек для валидатора, если есть.
                 * 2. Пнуть папу на валидацию
                 */
                this.AttachEvent(Statuses.SUCCESS,function(){

                    Success = true;

                    if( Parent ){

                        var ParentDependencies = Parent.GetDependencies();
                        var ParentValidators = Parent.GetValidators();

                        if (this.name && ParentDependencies.hasOwnProperty(this.name)){
                            for( var dependent in ParentDependencies[this.name] )
                                if (ParentValidators.hasOwnProperty(ParentDependencies[this.name][dependent])){
                                    ParentValidators[ParentDependencies[this.name][dependent]].Submit();
                                    ParentValidators[ParentDependencies[this.name][dependent]].Validate(true);
                                }
                        }

                        /**
                         *  Если все готово, папа выполнит функции, навешанные
                         *  на READY_TO_TEST (например моргание кнопочкой регистрации)
                         */
                        Parent.CheckReady();

                        /**
                         * Если инициатором проверки стал папа, - пусть проверяется дальше
                         */
                        if ( Parent.IsSubmit()){
                            Parent.Validate();
                        }
                    }
                });

                /**
                 * Уведомить папу, если всё плохо, чтоб не валидировался
                 */
                this.AttachEvent(Statuses.FAIL,function(){

                    Success = false;

                    if ( Parent ) {
                        Parent.SetStatus(Statuses.FAIL);
                        Parent.UnSubmit();
                    }
                });

                this.AttachEvent(Statuses.PROCESSING, function(){
                    LastValue = this.Value();
                });

                return this;
            }
        }
    
    } catch(e) {  window.error.push(e); }

}(window.jQuery);
