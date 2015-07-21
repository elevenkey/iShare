/* 方法:Array.remove(dx)
 * 功能:删除数组元素.
 * 参数:dx删除元素的下标.
 * 返回:在原数组上修改数组
 */
//经常用的是通过遍历,重构数组.
Array.prototype.remove=function(dx){
        if(isNaN(dx)||dx>this.length){return false;}
        for(var i=0,n=0;i<this.length;i++){
                if(this[i]!==this[dx]){this[n++]=this[i];}
        }
        this.length-=1;
};
//在数组中获取指定值的项目索引
Array.prototype.getIndexByValue= function(value){
        var index = -1;
        for (var i = 0; i < this.length; i++)
        {
                if (angular.equals(this[i], value))
                {
                        index = i;
                        break;
                }
        }
        return index;
};