export default {
    name: 'jsonView',
    props: {
        data: { // 传入的json数据
            type: [Object, Array],
            required: true
        },
        jsonKey: {// json的key值，用于第二层及二层以上的组件的key值
            type: String,
            default: ''
        },
        closed: { // 是否折叠
            type: Boolean,
            default: false
        },
        isLast: { //是否是最后一行
            type: Boolean,
            default: true
        },
        fontSize: { //字体大小
            type: Number,
            default: 14
        },
        lineHeight: { //杭高
            type: Number,
            default: 24
        },
        deep: { // 展开深度
            type: Number,
            default: 5
        },
        currentDeep: { // 当前为递归的第几层
            type: Number,
            default: 1
        },
        iconStyle: { // 折叠icon样式
            type: String,
            default: 'square'
        },
        iconColor: {//icon颜色
            type: Array,
            default () {
                return []
            }
        },
        theme: { // 主题
            type: String,
            default: 'vs-code'
        }
    },
    data () {
        return {
            innerclosed: true,
            templateDeep: 1
        };
    },
    computed: {
        isArray () {
            return Object.prototype.toString.call(this.data) === '[object Array]';
        },
        length () {
            return this.isArray ? this.data.length : Object.keys(this.data).length;
        },
        subfix () {
            return (this.isArray ? ']' : '}') + (this.isLast ? '' : ',');
        },
        prefix () {
            return this.isArray ? '[' : '{';
        },
        items () {
            if (this.isArray) {
                return this.data.map(item => {
                    const isJSON = this.isObjectOrArray(item);
                    return {
                        value: item,
                        isJSON,
                        key: ''
                    };
                });
            }
            const json = this.data;
            return Object.keys(json).map(key => {
                const item = json[key];
                const isJSON = this.isObjectOrArray(item);
                return {
                    value: item,
                    isJSON,
                    key
                };
            });
        },
        iconColors () {
            const { theme, iconColor } = this;
            if (iconColor.length === 2) {
                return iconColor;
            } else {
                if (theme === 'one-dark') {
                    return ['#747983', '#747983'];
                } else if (theme === 'vs-code') {
                    return ['#c6c6c6', '#c6c6c6'];
                } else {
                    return ['#747983', '#747983'];
                }
            }
        }
    },
    created () {
        this.innerclosed = this.closed;
        this.templateDeep = this.currentDeep;
        this.$watch('closed', () => {
            this.innerclosed = this.closed;
        });
    },
    mounted () {


    },
    methods: {
        isObjectOrArray (source) {
            const type = Object.prototype.toString.call(source);
            const res = type === '[object Array]' || type === '[object Object]';
            return res;
        },
        toggleClose () {
            if (this.length === 0) {
                return;
            }
            if (this.innerclosed) {
                this.innerclosed = false;
            } else {
                this.innerclosed = true;
            }
        },
        isClose (curDeep) {
            return curDeep > this.deep;
        },
        valueType (item) {
            if (item.value === null) {
                return 'null';
            } else {
                return typeof item.value
            }
        }
    }
};
