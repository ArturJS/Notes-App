webpackJsonpac__name_([0],{

/***/ "./node_modules/@ngrx/effects/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_effects__ = __webpack_require__("./node_modules/@ngrx/effects/src/effects.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_actions__ = __webpack_require__("./node_modules/@ngrx/effects/src/actions.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_effects_module__ = __webpack_require__("./node_modules/@ngrx/effects/src/effects.module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_effects_subscription__ = __webpack_require__("./node_modules/@ngrx/effects/src/effects-subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_util__ = __webpack_require__("./node_modules/@ngrx/effects/src/util.js");
/* harmony reexport (binding) */ __webpack_require__.d(exports, "mergeEffects", function() { return __WEBPACK_IMPORTED_MODULE_0__src_effects__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Effect", function() { return __WEBPACK_IMPORTED_MODULE_0__src_effects__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Actions", function() { return __WEBPACK_IMPORTED_MODULE_1__src_actions__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "EffectsModule", function() { return __WEBPACK_IMPORTED_MODULE_2__src_effects_module__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "EffectsSubscription", function() { return __WEBPACK_IMPORTED_MODULE_3__src_effects_subscription__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "toPayload", function() { return __WEBPACK_IMPORTED_MODULE_4__src_util__["a"]; });





//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/actions.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_store__ = __webpack_require__("./node_modules/@ngrx/store/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__ = __webpack_require__("./node_modules/rxjs/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Actions; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions(actionsSubject) {
        _super.call(this);
        this.source = actionsSubject;
    }
    Actions.prototype.lift = function (operator) {
        var observable = new Actions(this);
        observable.operator = operator;
        return observable;
    };
    Actions.prototype.ofType = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__["filter"].call(this, function (_a) {
            var type = _a.type;
            var len = keys.length;
            if (len === 1) {
                return type === keys[0];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if (keys[i] === type) {
                        return true;
                    }
                }
            }
            return false;
        });
    };
    Actions.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Actions.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Dispatcher"],] },] },
    ];
    return Actions;
}(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"]));
//# sourceMappingURL=actions.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/bootstrap-listener.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/index.js");
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return afterBootstrapEffects; });
/* harmony export (immutable) */ exports["b"] = runAfterBootstrapEffects;

var afterBootstrapEffects = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('ngrx:effects: Bootstrap Effects');
function runAfterBootstrapEffects(injector, subscription) {
    return function () {
        var effectInstances = injector.get(afterBootstrapEffects, false);
        if (effectInstances) {
            subscription.addEffects(effectInstances);
        }
    };
}
//# sourceMappingURL=bootstrap-listener.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/effects-subscription.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_store__ = __webpack_require__("./node_modules/@ngrx/store/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription__ = __webpack_require__("./node_modules/rxjs/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__ = __webpack_require__("./node_modules/rxjs/observable/merge.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__effects__ = __webpack_require__("./node_modules/@ngrx/effects/src/effects.js");
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return effects; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return EffectsSubscription; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





var effects = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('ngrx/effects: Effects');
var EffectsSubscription = (function (_super) {
    __extends(EffectsSubscription, _super);
    function EffectsSubscription(store, parent, effectInstances) {
        _super.call(this);
        this.store = store;
        this.parent = parent;
        if (Boolean(parent)) {
            parent.add(this);
        }
        if (Boolean(effectInstances)) {
            this.addEffects(effectInstances);
        }
    }
    EffectsSubscription.prototype.addEffects = function (effectInstances) {
        var sources = effectInstances.map(__WEBPACK_IMPORTED_MODULE_4__effects__["a" /* mergeEffects */]);
        var merged = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__["merge"].apply(void 0, sources);
        this.add(merged.subscribe(this.store));
    };
    EffectsSubscription.prototype.ngOnDestroy = function () {
        if (!this.closed) {
            this.unsubscribe();
        }
    };
    EffectsSubscription.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    EffectsSubscription.ctorParameters = [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Store"],] },] },
        { type: EffectsSubscription, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [effects,] },] },
    ];
    return EffectsSubscription;
}(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription__["Subscription"]));
//# sourceMappingURL=effects-subscription.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/effects.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_observable_merge__ = __webpack_require__("./node_modules/rxjs/observable/merge.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_observable_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_observable_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_ignoreElements__ = __webpack_require__("./node_modules/rxjs/operator/ignoreElements.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_ignoreElements___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_operator_ignoreElements__);
/* harmony export (immutable) */ exports["b"] = Effect;
/* unused harmony export getEffectsMetadata */
/* harmony export (immutable) */ exports["a"] = mergeEffects;


var METADATA_KEY = '@ngrx/effects';
function Effect(_a) {
    var dispatch = (_a === void 0 ? { dispatch: true } : _a).dispatch;
    return function (target, propertyName) {
        if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
            Reflect.defineMetadata(METADATA_KEY, [], target);
        }
        var effects = Reflect.getOwnMetadata(METADATA_KEY, target);
        var metadata = { propertyName: propertyName, dispatch: dispatch };
        Reflect.defineMetadata(METADATA_KEY, effects.concat([metadata]), target);
    };
}
function getEffectsMetadata(instance) {
    var target = Object.getPrototypeOf(instance);
    if (!Reflect.hasOwnMetadata(METADATA_KEY, target)) {
        return [];
    }
    return Reflect.getOwnMetadata(METADATA_KEY, target);
}
function mergeEffects(instance) {
    var observables = getEffectsMetadata(instance).map(function (_a) {
        var propertyName = _a.propertyName, dispatch = _a.dispatch;
        var observable = typeof instance[propertyName] === 'function' ?
            instance[propertyName]() : instance[propertyName];
        if (dispatch === false) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_ignoreElements__["ignoreElements"].call(observable);
        }
        return observable;
    });
    return __WEBPACK_IMPORTED_MODULE_0_rxjs_observable_merge__["merge"].apply(void 0, observables);
}
//# sourceMappingURL=effects.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/effects.module.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions__ = __webpack_require__("./node_modules/@ngrx/effects/src/actions.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__effects_subscription__ = __webpack_require__("./node_modules/@ngrx/effects/src/effects-subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bootstrap_listener__ = __webpack_require__("./node_modules/@ngrx/effects/src/bootstrap-listener.js");
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return EffectsModule; });




var EffectsModule = (function () {
    function EffectsModule() {
    }
    EffectsModule.run = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                __WEBPACK_IMPORTED_MODULE_2__effects_subscription__["a" /* EffectsSubscription */],
                type,
                { provide: __WEBPACK_IMPORTED_MODULE_2__effects_subscription__["b" /* effects */], useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.runAfterBootstrap = function (type) {
        return {
            ngModule: EffectsModule,
            providers: [
                type,
                { provide: __WEBPACK_IMPORTED_MODULE_3__bootstrap_listener__["a" /* afterBootstrapEffects */], useExisting: type, multi: true }
            ]
        };
    };
    EffectsModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    providers: [
                        __WEBPACK_IMPORTED_MODULE_1__actions__["a" /* Actions */],
                        __WEBPACK_IMPORTED_MODULE_2__effects_subscription__["a" /* EffectsSubscription */],
                        {
                            provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["APP_BOOTSTRAP_LISTENER"],
                            multi: true,
                            deps: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"], __WEBPACK_IMPORTED_MODULE_2__effects_subscription__["a" /* EffectsSubscription */]],
                            useFactory: __WEBPACK_IMPORTED_MODULE_3__bootstrap_listener__["b" /* runAfterBootstrapEffects */]
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    EffectsModule.ctorParameters = [];
    return EffectsModule;
}());
//# sourceMappingURL=effects.module.js.map

/***/ },

/***/ "./node_modules/@ngrx/effects/src/util.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = toPayload;
function toPayload(action) {
    return action.payload;
}
//# sourceMappingURL=util.js.map

/***/ },

/***/ "./src/app/pages/notes-page/directives/stretch-by-content/stretch-by-content.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var StretchByContentDirective = (function () {
    function StretchByContentDirective(el) {
        this.el = el;
    }
    StretchByContentDirective.prototype.ngOnInit = function () {
        this.updateHeight();
    };
    StretchByContentDirective.prototype.updateHeight = function () {
        var element = this.el.nativeElement;
        element.style.height = '0px';
        element.style.height = element.scrollHeight + 5 + 'px';
    };
    __decorate([
        core_1.HostListener('input'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], StretchByContentDirective.prototype, "updateHeight", null);
    StretchByContentDirective = __decorate([
        core_1.Directive({
            selector: '[stretch-by-content]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], StretchByContentDirective);
    return StretchByContentDirective;
    var _a;
}());
exports.StretchByContentDirective = StretchByContentDirective;


/***/ },

/***/ "./src/app/pages/notes-page/note/note.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var _ = __webpack_require__("./node_modules/lodash/lodash.js");
var Note = (function () {
    function Note(fb) {
        this.fb = fb;
        this.onEdit = new core_1.EventEmitter();
        this.onRemove = new core_1.EventEmitter();
        this.onSave = new core_1.EventEmitter();
        this.noteForm = this.fb.group({
            title: ['', [
                    forms_1.Validators.required
                ]],
            description: ['', [
                    forms_1.Validators.required
                ]]
        });
    }
    Note.prototype.editNote = function (note) {
        this.onEdit.emit(note);
        this.noteForm.setValue({
            title: note.title,
            description: note.description
        });
    };
    Note.prototype.removeNote = function (note) {
        this.onRemove.emit(note);
    };
    Note.prototype.saveNote = function (note) {
        note = Object.assign(note, this.noteForm.getRawValue());
        this.onSave.emit(note);
    };
    Note.prototype.linksFommatter = function (text) {
        var linkRegexp = /(http[^\s]+)/g;
        text = _.escape(text);
        return text.replace(linkRegexp, "<a href=\"$1\" target=\"_blank\" rel=\"nofollow noopener\" style=\"color: #fff;\">$1</a>");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Note.prototype, "isEditingNote", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Note.prototype, "note", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], Note.prototype, "onEdit", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], Note.prototype, "onRemove", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
    ], Note.prototype, "onSave", void 0);
    Note = __decorate([
        core_1.Component({
            selector: 'note',
            template: __webpack_require__("./src/app/pages/notes-page/note/note.html"),
            styles: [__webpack_require__("./src/app/pages/notes-page/note/note.scss")],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [(typeof (_d = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _d) || Object])
    ], Note);
    return Note;
    var _a, _b, _c, _d;
}());
exports.Note = Note;


/***/ },

/***/ "./src/app/pages/notes-page/note/note.html":
/***/ function(module, exports) {

module.exports = "<form [formGroup]=\"noteForm\"\n      class=\"note-item\"\n      novalidate>\n\n  <i class=\"glyphicon glyphicon-remove remove-note\"\n     (click)=\"removeNote(note)\"></i>\n\n  <i class=\"glyphicon glyphicon-pencil edit-note\"\n     (click)=\"editNote(note)\"\n     [hidden]=\"isEditingNote\"></i>\n\n  <i class=\"glyphicon glyphicon-floppy-disk save-note\"\n     (click)=\"noteForm.valid && saveNote(note)\"\n     [hidden]=\"!isEditingNote\"\n     [class.disabled]=\"!noteForm.valid\"></i>\n\n  <div *ngIf=\"!isEditingNote\">\n    <h3 class=\"note-title\">{{note.title}}</h3>\n    <div class=\"note-description\" [innerHTML]=\"linksFommatter(note.description)\"></div>\n  </div>\n\n  <div class=\"note-for-edit-cnt\"\n       *ngIf=\"isEditingNote\">\n    <h3 class=\"note-title\">\n      <input class=\"w100 edit-input\"\n             type=\"text\"\n             placeholder=\"Enter title here...\"\n             [formControl]=\"noteForm.controls.title\"/>\n    </h3>\n    <div class=\"note-description\">\n        <textarea class=\"w100 mw100 edit-description\"\n                  placeholder=\"Enter description here...\"\n                  [formControl]=\"noteForm.controls.description\"\n                  stretch-by-content></textarea>\n    </div>\n  </div>\n\n</form>\n"

/***/ },

/***/ "./src/app/pages/notes-page/note/note.scss":
/***/ function(module, exports) {

module.exports = ".note-item .remove-note {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  font-style: normal;\n  cursor: pointer;\n  color: #FFFFFF; }\n\n.note-item .edit-note {\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  font-style: normal;\n  cursor: pointer;\n  color: #FFFFFF; }\n\n.note-item .save-note {\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  font-style: normal;\n  cursor: pointer;\n  color: #FFFFFF; }\n  .note-item .save-note:disabled, .note-item .save-note[disabled=\"disabled\"], .note-item .save-note .disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n  .note-item .save-note .disabled {\n    pointer-events: none; }\n\n.note-item .note-title .edit-input, .note-item .note-title .edit-description, .note-item .note-description .edit-input, .note-item .note-description .edit-description {\n  color: #000000; }\n\n.note-item .note-title .edit-input, .note-item .note-description .edit-input {\n  text-align: center; }\n\n.note-item .note-title {\n  margin: 0;\n  padding: 10px 0;\n  text-align: center; }\n\n.note-item .note-description {\n  padding: 5px 0; }\n\n.note-item div:not(.note-for-edit-cnt) .note-title, .note-item div:not(.note-for-edit-cnt) .note-description {\n  white-space: pre-wrap;\n  word-wrap: break-word; }\n\na {\n  color: #FFFFFF !important; }\n"

/***/ },

/***/ "./src/app/pages/notes-page/notes-page.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var store_1 = __webpack_require__("./node_modules/@ngrx/store/index.js");
var effects_1 = __webpack_require__("./node_modules/@ngrx/effects/index.js");
var services_1 = __webpack_require__("./src/app/shared/services/index.ts");
var components_1 = __webpack_require__("./src/app/shared/components/index.ts");
var notes_actions_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes.actions.ts");
var notes_page_reducer_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes-page.reducer.ts");
var angularfire2_1 = __webpack_require__("./node_modules/angularfire2/index.js");
var _ = __webpack_require__("./node_modules/lodash/lodash.js");
var NotesPage = (function (_super) {
    __extends(NotesPage, _super);
    function NotesPage(fb, router, store, storeService, noteActions, actions$, af) {
        _super.call(this, storeService, NotesPage.reducers);
        this.fb = fb;
        this.router = router;
        this.store = store;
        this.storeService = storeService;
        this.noteActions = noteActions;
        this.actions$ = actions$;
        this.notesList = af.database.list('/todos');
        this.isEditingNote = {};
        this.newNoteForm = this.fb.group({
            title: ['', [
                    forms_1.Validators.required
                ]],
            description: ['', [
                    forms_1.Validators.required
                ]]
        });
    }
    NotesPage.initialize = function () {
        NotesPage.reducers = {
            note: notes_page_reducer_ts_1.notesReducer
        };
    };
    NotesPage.prototype.addNote = function () {
        var newNote = Object.assign({ id: Math.random() }, this.newNoteForm.value);
        this.notesList.push(newNote);
        this.newNoteForm.setValue({ title: '', description: '' });
    };
    NotesPage.prototype.removeNote = function (note) {
        this.notesList.remove(note.$key);
    };
    NotesPage.prototype.editNote = function (note) {
        this.isEditingNote[note.id] = true;
    };
    NotesPage.prototype.saveNote = function (note) {
        this.isEditingNote[note.id] = false;
        this.notesList.update(note.$key, _.pick(note, ['id', 'title', 'description']));
    };
    NotesPage.prototype.onInit = function () {
    };
    NotesPage.prototype.onDestroy = function () {
    };
    NotesPage = __decorate([
        core_1.Component({
            selector: 'notes-page',
            template: __webpack_require__("./src/app/pages/notes-page/notes-page.html"),
            styles: [__webpack_require__("./src/app/pages/notes-page/notes-page.scss")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof store_1.Store !== 'undefined' && store_1.Store) === 'function' && _c) || Object, (typeof (_d = typeof services_1.StoreService !== 'undefined' && services_1.StoreService) === 'function' && _d) || Object, (typeof (_e = typeof notes_actions_ts_1.NotesActions !== 'undefined' && notes_actions_ts_1.NotesActions) === 'function' && _e) || Object, (typeof (_f = typeof effects_1.Actions !== 'undefined' && effects_1.Actions) === 'function' && _f) || Object, (typeof (_g = typeof angularfire2_1.AngularFire !== 'undefined' && angularfire2_1.AngularFire) === 'function' && _g) || Object])
    ], NotesPage);
    return NotesPage;
    var _a, _b, _c, _d, _e, _f, _g;
}(components_1.AbstractSmartComponent));
exports.NotesPage = NotesPage;
//instead of static constructor
NotesPage.initialize(); //see also https://basarat.gitbooks.io/typescript/content/docs/tips/staticConstructor.html


/***/ },

/***/ "./src/app/pages/notes-page/notes-page.html":
/***/ function(module, exports) {

module.exports = "<div class=\"wh100 notes-page\">\n\n  <h1 class=\"text-center\">Notes</h1>\n\n  <form [formGroup]=\"newNoteForm\"\n        (ngSubmit)=\"newNoteForm.valid && addNote()\"\n        class=\"input-form w100\"\n        novalidate>\n    <div class=\"title-input-container\">\n      <input type=\"text\"\n             class=\"title-input w100\"\n             placeholder=\"Enter some title here...\"\n             [formControl]=\"newNoteForm.controls.title\">\n    </div>\n    <div class=\"description-input-container\">\n      <textarea class=\"description-area w100\"\n                [formControl]=\"newNoteForm.controls.description\"\n                placeholder=\"Enter some description here...\"\n                stretch-by-content></textarea>\n    </div>\n    <div class=\"buttons-container\">\n      <button class=\"btn-add-note\"\n              type=\"submit\"\n              [disabled]=\"!newNoteForm.valid\">\n        Add!\n      </button>\n    </div>\n  </form>\n\n  <div class=\"notes-container\">\n    <note *ngFor=\"let note of notesList | async\"\n          [note]=\"note\"\n          [isEditingNote]=\"isEditingNote[note.id]\"\n          (onEdit)=\"editNote($event)\"\n          (onRemove)=\"removeNote($event)\"\n          (onSave)=\"saveNote($event)\"></note>\n  </div>\n\n</div>\n"

/***/ },

/***/ "./src/app/pages/notes-page/notes-page.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var notes_page_component_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes-page.component.ts");
var note_component_1 = __webpack_require__("./src/app/pages/notes-page/note/note.component.ts");
var stretch_by_content_directive_1 = __webpack_require__("./src/app/pages/notes-page/directives/stretch-by-content/stretch-by-content.directive.ts");
var shared_1 = __webpack_require__("./src/app/shared/index.ts");
var notes_effects_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes.effects.ts");
var notes_page_routing_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes-page.routing.ts");
var effects_1 = __webpack_require__("./node_modules/@ngrx/effects/index.js");
var notes_actions_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes.actions.ts");
var NotesPageModule = (function () {
    function NotesPageModule() {
    }
    NotesPageModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_1.SharedModule,
                notes_page_routing_ts_1.ROUTING,
                effects_1.EffectsModule.run(notes_effects_ts_1.NotesEffects)
            ],
            declarations: [
                notes_page_component_ts_1.NotesPage,
                note_component_1.Note,
                stretch_by_content_directive_1.StretchByContentDirective
            ],
            providers: [
                notes_actions_ts_1.NotesActions
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], NotesPageModule);
    return NotesPageModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotesPageModule;


/***/ },

/***/ "./src/app/pages/notes-page/notes-page.reducer.ts":
/***/ function(module, exports) {

"use strict";
/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */
"use strict";
/*const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} = NoteActions;*/
var initialState = {};
exports.notesReducer = function (store, action) {
    if (store === void 0) { store = initialState; }
    var payload = action.payload;
    switch (action.type) {
        /*case LOGIN:
          return Object.assign({}, store, {
            userData: new User(payload),
            isWrongCredentials: false
          });
        case LOGIN_SUCCESS:
          return Object.assign({}, store, {
            isLoggedIn: true,
            isWrongCredentials: false
          });
        case LOGIN_FAILED:
          return Object.assign({}, store, {isWrongCredentials: true});*/
        default:
            return store;
    }
};


/***/ },

/***/ "./src/app/pages/notes-page/notes-page.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/**
 * Created by Artur_Nizamutdinov on 10/11/2016.
 */
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var notes_page_component_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes-page.component.ts");
var ROUTES = [
    {
        path: '',
        component: notes_page_component_ts_1.NotesPage,
        pathMatch: 'full'
    }
];
exports.ROUTING = router_1.RouterModule.forChild(ROUTES);


/***/ },

/***/ "./src/app/pages/notes-page/notes-page.scss":
/***/ function(module, exports) {

module.exports = ".input-form {\n  border: 0;\n  background: #3949AB;\n  padding: 15px;\n  transition: box-shadow 0.2s ease-in;\n  box-shadow: 0 0 0 transparent; }\n  .input-form:hover {\n    box-shadow: 0px 5px 30px 5px rgba(0, 0, 0, 0.6); }\n  .input-form .title-input-container, .input-form .description-input-container {\n    margin-bottom: 15px; }\n  .input-form .title-input {\n    font-size: 24px;\n    padding: 10px 15px; }\n  .input-form .description-area {\n    font-size: 16px;\n    padding: 10px 15px;\n    max-width: 100%; }\n  .input-form .btn-add-note {\n    border: 0;\n    background: #F44336;\n    color: #FFEBEE;\n    padding: 10px 15px;\n    cursor: pointer; }\n    .input-form .btn-add-note:disabled, .input-form .btn-add-note[disabled=\"disabled\"], .input-form .btn-add-note .disabled {\n      cursor: not-allowed;\n      opacity: 0.5; }\n    .input-form .btn-add-note .disabled {\n      pointer-events: none; }\n\n.notes-container {\n  display: flex;\n  flex-wrap: wrap;\n  margin-bottom: 20px; }\n\nnote {\n  width: 100%;\n  display: inline-block;\n  background: #663399;\n  margin-top: 20px;\n  padding: 10px 15px;\n  color: #FFFFFF;\n  position: relative;\n  vertical-align: top;\n  transition: box-shadow 0.2s ease-in;\n  box-shadow: 0 0 0 transparent; }\n  note:hover {\n    box-shadow: 0px 5px 30px 5px rgba(0, 0, 0, 0.6); }\n\n@media all and (min-width: 520px) and (max-width: 779px) {\n  note {\n    width: calc(50% - 10px); }\n    note:nth-child(even) {\n      margin-left: 20px; } }\n\n@media all and (min-width: 780px) {\n  note {\n    width: 240px; }\n    note:nth-child(3n-1) {\n      margin: 20px 20px 0; } }\n"

/***/ },

/***/ "./src/app/pages/notes-page/notes.actions.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var store_1 = __webpack_require__("./node_modules/@ngrx/store/index.js");
var NotesActions = (function () {
    function NotesActions(_store) {
        this._store = _store;
    }
    NotesActions = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof store_1.Store !== 'undefined' && store_1.Store) === 'function' && _a) || Object])
    ], NotesActions);
    return NotesActions;
    var _a;
}());
exports.NotesActions = NotesActions;


/***/ },

/***/ "./src/app/pages/notes-page/notes.effects.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/**
 * Created by Artur_Nizamutdinov on 10/19/2016.
 */
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var effects_1 = __webpack_require__("./node_modules/@ngrx/effects/index.js");
var services_1 = __webpack_require__("./src/app/shared/services/index.ts");
var notes_actions_ts_1 = __webpack_require__("./src/app/pages/notes-page/notes.actions.ts");
var NotesEffects = (function () {
    function NotesEffects(actions$, authService, loginActions) {
        this.actions$ = actions$;
        this.authService = authService;
        this.loginActions = loginActions;
    }
    NotesEffects = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof effects_1.Actions !== 'undefined' && effects_1.Actions) === 'function' && _a) || Object, (typeof (_b = typeof services_1.AuthService !== 'undefined' && services_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof notes_actions_ts_1.NotesActions !== 'undefined' && notes_actions_ts_1.NotesActions) === 'function' && _c) || Object])
    ], NotesEffects);
    return NotesEffects;
    var _a, _b, _c;
}());
exports.NotesEffects = NotesEffects;


/***/ }

});
//# sourceMappingURL=0.map