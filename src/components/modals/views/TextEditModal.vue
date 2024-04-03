<template>
    <div class="modal-content fm-modal-text-edit">
        <div class="modal-header">
            <h5 class="modal-title w-75 text-truncate">
                {{ lang.modal.editor.title }}
                <small class="text-muted pl-3">{{ selectedItem.basename }}</small>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" v-on:click="hideModal"></button>
        </div>
        <div class="modal-body">
            <!--<codemirror
                ref="fmCodeEditor"
                v-bind:value="code"
                v-bind:options="cmOptions"
                v-bind:height="editorHeight"
                v-on:change="onChange"
            />-->
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-info" v-on:click="updateFile">
                {{ lang.btn.submit }}
            </button>
            <button type="button" class="btn btn-light" v-on:click="hideModal">
                {{ lang.btn.cancel }}
            </button>
        </div>
    </div>
</template>

<script>
/*import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/php/php';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/lua/lua';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/python/python';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/go/go';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/properties/properties';*/
import modal from '../mixins/modal';
import translate from '../../../mixins/translate';

export default {
    name: 'TextEditModal',
    mixins: [modal, translate],
    //components: { Codemirror },
    data() {
        return {
            code: '',
            editedCode: '',
        };
    },
    mounted() {
        // get file for edit
        this.$store
            .dispatch('fm/getFile', {
                disk: this.selectedDisk,
                path: this.selectedItem.path,
            })
            .then((response) => {
                // add code
                if (this.selectedItem.extension === 'json') {
                    this.code = JSON.stringify(response.data, null, 4);
                } else {
                    this.code = response.data;
                }
            });
    },
    computed: {
        /**
         * Selected disk
         * @returns {*}
         */
        selectedDisk() {
            return this.$store.getters['fm/selectedDisk'];
        },

        /**
         * Selected file
         * @returns {*}
         */
        selectedItem() {
            return this.$store.getters['fm/selectedItems'][0];
        },

        /**
         * CodeMirror options
         * @returns {{mode: *, lineNumbers: boolean, line: boolean, theme: string}}
         */
        cmOptions() {
            return {
                mode: this.$store.state.fm.settings.textExtensions[this.selectedItem.extension],
                theme: 'blackboard',
                lineNumbers: true,
                line: true,
            };
        },

        /**
         * Calculate the height of the code editor
         * @returns {number}
         */
        editorHeight() {
            if (this.$store.state.fm.modal.modalBlockHeight) {
                return this.$store.state.fm.modal.modalBlockHeight - 200;
            }

            return 300;
        },
    },
    methods: {
        /**
         * Update file
         */
        updateFile() {
            const formData = new FormData();
            // add disk name
            formData.append('disk', this.selectedDisk);
            // add path
            formData.append('path', this.selectedItem.dirname);
            // add updated file
            formData.append('file', new Blob([this.editedCode]), this.selectedItem.basename);

            this.$store.dispatch('fm/updateFile', formData).then((response) => {
                if (response.data.result.status === 'success') {
                    this.hideModal();
                }
            });
        },

        /**
         * Edited code
         * @param value
         */
        onChange(value) {
            this.editedCode = value;
        },
    },
};
</script>

<style lang="scss">
@import 'codemirror/theme/blackboard.css';

.fm-modal-text-edit {
    .modal-body {
        padding: 0;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1055;
    display: none;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 0.5rem;
    pointer-events: none;
}
.modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
    transform: translate(0, -50px);
}
@media (prefers-reduced-motion: reduce) {
    .modal.fade .modal-dialog {
        transition: none;
    }
}
.modal.show .modal-dialog {
    transform: none;
}
.modal.modal-static .modal-dialog {
    transform: scale(1.02);
}

.modal-dialog-scrollable {
    height: calc(100% - 1rem);
}
.modal-dialog-scrollable .modal-content {
    max-height: 100%;
    overflow: hidden;
}
.modal-dialog-scrollable .modal-body {
    overflow-y: auto;
}

.modal-dialog-centered {
    display: flex;
    align-items: center;
    min-height: calc(100% - 1rem);
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100vw;
    height: 100vh;
    background-color: #000;
}
.modal-backdrop.fade {
    opacity: 0;
}
.modal-backdrop.show {
    opacity: 0.5;
}

.modal-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
}
.modal-header .btn-close {
    padding: 0.5rem 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem auto;
}

.modal-title {
    margin-bottom: 0;
    line-height: 1.5;
}

.modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
}

.modal-footer {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(0.3rem - 1px);
    border-bottom-left-radius: calc(0.3rem - 1px);
}
.modal-footer > * {
    margin: 0.25rem;
}

@media (min-width: 576px) {
    .modal-dialog {
        max-width: 500px;
        margin: 1.75rem auto;
    }

    .modal-dialog-scrollable {
        height: calc(100% - 3.5rem);
    }

    .modal-dialog-centered {
        min-height: calc(100% - 3.5rem);
    }

    .modal-sm {
        max-width: 300px;
    }
}
@media (min-width: 992px) {
    .modal-lg,
    .modal-xl {
        max-width: 800px;
    }
}
@media (min-width: 1200px) {
    .modal-xl {
        max-width: 1140px;
    }
}
.modal-fullscreen {
    width: 100vw;
    max-width: none;
    height: 100%;
    margin: 0;
}
.modal-fullscreen .modal-content {
    height: 100%;
    border: 0;
    border-radius: 0;
}
.modal-fullscreen .modal-header {
    border-radius: 0;
}
.modal-fullscreen .modal-body {
    overflow-y: auto;
}
.modal-fullscreen .modal-footer {
    border-radius: 0;
}

@media (max-width: 575.98px) {
    .modal-fullscreen-sm-down {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    .modal-fullscreen-sm-down .modal-content {
        height: 100%;
        border: 0;
        border-radius: 0;
    }
    .modal-fullscreen-sm-down .modal-header {
        border-radius: 0;
    }
    .modal-fullscreen-sm-down .modal-body {
        overflow-y: auto;
    }
    .modal-fullscreen-sm-down .modal-footer {
        border-radius: 0;
    }
}
@media (max-width: 767.98px) {
    .modal-fullscreen-md-down {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    .modal-fullscreen-md-down .modal-content {
        height: 100%;
        border: 0;
        border-radius: 0;
    }
    .modal-fullscreen-md-down .modal-header {
        border-radius: 0;
    }
    .modal-fullscreen-md-down .modal-body {
        overflow-y: auto;
    }
    .modal-fullscreen-md-down .modal-footer {
        border-radius: 0;
    }
}
@media (max-width: 991.98px) {
    .modal-fullscreen-lg-down {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    .modal-fullscreen-lg-down .modal-content {
        height: 100%;
        border: 0;
        border-radius: 0;
    }
    .modal-fullscreen-lg-down .modal-header {
        border-radius: 0;
    }
    .modal-fullscreen-lg-down .modal-body {
        overflow-y: auto;
    }
    .modal-fullscreen-lg-down .modal-footer {
        border-radius: 0;
    }
}
@media (max-width: 1199.98px) {
    .modal-fullscreen-xl-down {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    .modal-fullscreen-xl-down .modal-content {
        height: 100%;
        border: 0;
        border-radius: 0;
    }
    .modal-fullscreen-xl-down .modal-header {
        border-radius: 0;
    }
    .modal-fullscreen-xl-down .modal-body {
        overflow-y: auto;
    }
    .modal-fullscreen-xl-down .modal-footer {
        border-radius: 0;
    }
}
@media (max-width: 1399.98px) {
    .modal-fullscreen-xxl-down {
        width: 100vw;
        max-width: none;
        height: 100%;
        margin: 0;
    }
    .modal-fullscreen-xxl-down .modal-content {
        height: 100%;
        border: 0;
        border-radius: 0;
    }
    .modal-fullscreen-xxl-down .modal-header {
        border-radius: 0;
    }
    .modal-fullscreen-xxl-down .modal-body {
        overflow-y: auto;
    }
    .modal-fullscreen-xxl-down .modal-footer {
        border-radius: 0;
    }
}
</style>
