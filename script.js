function show_block(item, block_name){

    // clear all classes from block2
    var block_2 = document.getElementsByClassName('block2');
    
    for(i = 0; i < block_2.length; i++){

        // remove hidden class
        block_2[i].classList.remove('hidden');

        // remove show class
        block_2[i].classList.remove('show');
    
        // hide all
        block_2[i].classList.add('hidden');
    }
    
    
    // show only selected block
    document.getElementById(block_name).classList.add('show');
    document.querySelector('.active').classList.remove('active');
    item.classList.add('active');
    
}