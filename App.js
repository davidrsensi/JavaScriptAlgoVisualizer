//  Created by: David Sensibaugh


const arrSizeInput = document.getElementById('ArraySize');
const arraySizeSubmit = document.getElementById('ArraySizeSubmit');
const contentsDiv = document.getElementById('contentsDiv');
const BubbleSortSubmit = document.getElementById('BubbleSort');
const SelectionSortSubmit = document.getElementById('SelectionSort');
const MergeSortSubmit = document.getElementById('MergeSort');
const QuickSortSubmit = document.getElementById('QuickSort');
const speed = document.getElementById('Speed');

// Event listeners
arraySizeSubmit.addEventListener("click", GetArraySize);
BubbleSortSubmit.addEventListener("click", BubbleSort);
SelectionSortSubmit.addEventListener("click", SelectionSort);
MergeSortSubmit.addEventListener("click", MergeSortClick);
QuickSortSubmit.addEventListener("click", QuickSortClick);

// Colors for visualization.
const yellow = 'yellow-text';
const red = 'red-text';
const green = 'green-text';
const purple = 'vals pivot';
const childElements = contentsDiv.getElementsByTagName('*');

// Initialize array.
function GetArraySize (e) {
    const inputVal = arrSizeInput.value;
    let contents = '';
    let randomVal;

    if (inputVal > 0 && inputVal <= 20){

        // Make all sorting buttons visible.
        BubbleSortSubmit.setAttribute('style', 'display : visible');
        SelectionSortSubmit.setAttribute('style', 'display : visible');
        MergeSortSubmit.setAttribute('style', 'display : visible');
        QuickSortSubmit.setAttribute('style', 'display : visible');
        Speed.setAttribute('style', 'display : visible');

        // Create new div for size of array user inputs.
        for (let count = 0; count < inputVal; count++){
            randomVal = Math.floor(Math.random() * 460) + 15; // Minimum 15 so text is fully visible.
            contents += `<div id="${count}" class="vals" style="height: ${Math.floor(randomVal * 1.5)}px; width: 30px; font-size: 18px">
            ${randomVal} 
            </div>` 
        }
    }
    else{
        contents = "Please enter a number between 1 and 20 before pressing 'Submit'."
    }
    contentsDiv.innerHTML = contents; // Add divs to html.

    e.preventDefault();
}

async function MergeSortClick (e) {

    // On click start merge sort
    await MergeSort(0, childElements.length - 1); 

    e.preventDefault();
}

async function MergeSort (start, end) {

    // Find half size of array.
    let half = Math.floor((start + end) / 2);
    // If array length is 2 or less call merge function.
    if (end - start <= 1){
        await MergeSortMerge(start, half, end);
    }
    else{
        // Recursively call merge sort function on each half of array.
        await MergeSort(start, half);
        await MergeSort(half + 1, end);
        // Pass in two arrays to merge function.
        await MergeSortMerge(start, half, end);
    }
}

async function MergeSortMerge(start, half, end){

    let tempArray = [];
    const initStartVal = start;
    const initEndVal = end
    const halfIndex = half;
    half++; // Split array so half index isn't overlapping.

    for(let count = initStartVal; count <= initEndVal; count++){
        childElements[count].className = yellow;
    }
    await Sleep();

    // Look at first half and second half of array for which has a smaller value.
    while (start <= halfIndex && half <= end){
        if (parseInt(childElements[start].innerHTML) < parseInt(childElements[half].innerHTML)){
            tempArray.push(childElements[start].cloneNode(true)); // .cloneNode used to not change childElements by reference.
            start++;
        } 
        else {
            tempArray.push(childElements[half].cloneNode(true));
            half++;
        }
    }

    // Either first half or second half will have left over values, depending on which had smaller values.
    // Add final values to tempArray.
    while (start <= halfIndex){
        tempArray.push(childElements[start].cloneNode(true));
        start++;
    }
    while (half <= end){
        tempArray.push(childElements[half].cloneNode(true));
        half++;
    }

    for (let count = initStartVal; count <= initEndVal; count++){
        childElements[count].className = 'vals';
    }

    // Set childElements to tempArray values. TempArray index starts at 0 but childElements starts wherever the function looks at.
    for (let count = 0; count < tempArray.length; count++){
        childElements[count + initStartVal].innerHTML = tempArray[count].innerHTML;
        childElements[count + initStartVal].style.height = tempArray[count].style.height
        childElements[count + initStartVal].className = green;
    }
    await Sleep();
}

async function QuickSortClick (e) {
    
    // On click start quick sort.
    await QuickSort(0, childElements.length);

    e.preventDefault();
}

async function QuickSort (startIndex, arrayLen) {
    let lastIndex; // Find last index in array.
    if (startIndex === arrayLen){
        lastIndex = startIndex;
    } 
    else {
        if (arrayLen === 0){
            lastIndex = arrayLen;
        } 
        else {
            lastIndex = arrayLen - 1;
        }
    }

    let pivot; // Element in div that is selected as pivot.
    let pivotPlaced = false; // Pivot is in correct index if true.


    if ((lastIndex - startIndex) >= 2){ // If array > 3, find median of 3.
        let randomMidIndex = Math.floor(Math.random() * ((arrayLen - startIndex) - 1)) + (startIndex + 1);

        // Find median of 3 to get pivot.
        const indexBegin = parseInt(childElements[startIndex].innerHTML)
        const indexRandom = parseInt(childElements[randomMidIndex].innerHTML)
        const indexEnd = parseInt(childElements[lastIndex].innerHTML)

        if ((indexBegin <= indexRandom && indexBegin >= indexEnd) || (indexBegin >= indexRandom && indexBegin <= indexEnd)) {
            childElements[startIndex].className = "vals pivot";
            pivot = childElements[startIndex];
        } 
        else if ((indexRandom <= indexBegin && indexRandom >= indexEnd) || (indexRandom >= indexBegin && indexRandom <= indexEnd)) {
            childElements[randomMidIndex].className = "vals pivot";
            pivot = childElements[randomMidIndex];
        } 
        else {
            childElements[lastIndex].className = "vals pivot";
            pivot = childElements[lastIndex];
        }

    } 
    else {
        // If less than 3 elements passed in array, compare values and swap when needed.
        if (parseInt(childElements[lastIndex].innerHTML) >= parseInt(childElements[startIndex].innerHTML)) {
            // good
            childElements[startIndex].className = green;
            childElements[lastIndex].className = green;
            return;
        } 
        else {
            SwapValues(childElements[lastIndex], childElements[startIndex]);
            childElements[lastIndex].className = green;
            childElements[startIndex].className = green;
            return;
        }
    }
    
    let pivotFinalIndex = 0;
    let left = startIndex; // left pointer
    let right = lastIndex; // right pointer
    const pivotVal = parseInt(pivot.innerHTML);
    const pivotIndex = parseInt(pivot.id);
    let lessThanPivotFound;
    let greaterThanPivotFound;

    // Find index where pivot belongs in array.
    while(pivotPlaced === false){
        lessThanPivotFound = false;
        greaterThanPivotFound = false;

        // Starting from left side, find value greater than pivot.
        while(greaterThanPivotFound === false){

            if (left >= lastIndex){
                left = lastIndex;
                break;
            }
            // Skip value if looking at pivot.
            if (childElements[left] === pivot){
                left++;
            }
            childElements[left].className = yellow; 
            await Sleep();
            
            if (left >= right){
                childElements[left].className = 'vals';
                break;
            }
            // Break once we find value greater than pivot value.
            if (parseInt(childElements[left].innerHTML) > pivotVal){
                greaterThanPivotFound = true;
                break;
            }
            // Keep looping if value at current index not greater than pivot value.
            childElements[left].className = 'vals';
            left++;
        }

        // starting from right side, find value less than pivot
        while(lessThanPivotFound === false){
            
            if (right <= 0){
                right = 0;
                break;
            }
            // Skip value if looking at pivot.
            if (childElements[right] === pivot){
                right--;
            }
            childElements[right].className = yellow;
            await Sleep();

            if (right < left){
                childElements[right].className = 'vals';
                break;
            }
            // Break once we find value less than pivot value.
            if (parseInt(childElements[right].innerHTML) < pivotVal){
                lessThanPivotFound = true;
                break;
            }
            // Keep looping if value at current index not less than pivot value.
            childElements[right].className = 'vals';
            right--;
        }
        
        // If left pointer has passed the right pointer, find where pivot placement should be.
        // Pivot final location changes depending on where pivot is in relation to left/right pointers.
        if (left >= right){
            
            if (pivot === childElements[startIndex]){
                pivotFinalIndex = right; // Pivot on left
            } 
            else if (left === (right + 2)){
                pivotFinalIndex = right + 1; // Enter if pivot in correct location (right subtracts an extra unit when comparing to pivot).
            } 
            else if (pivotVal < parseInt(childElements[left].innerHTML) && parseInt(pivot.id) > parseInt(childElements[left].id) ){
                pivotFinalIndex = left; // Pivot on right side while pivot value less than left pointer.
            } 
            else if (pivotVal < parseInt(childElements[left].innerHTML)){
                pivotFinalIndex = right; // Pivot left of left pointer (but not at startIndex).
            } 
            else {
                pivotFinalIndex = left;
            }

            pivotPlaced = true;
            break;
        }

        await Sleep();
        childElements[left].className = red;
        childElements[right].className = red;
        await Sleep();
        // Swap values if larger value on left.
        if (parseInt(childElements[left].innerHTML) > parseInt(childElements[right].innerHTML) && parseInt(childElements[left].id) <  parseInt(childElements[right].id)){
            SwapValues(childElements[left], childElements[right]);
        } 
    
        childElements[left].className = green;
        childElements[right].className = green;
        await Sleep();
        childElements[left].className = 'vals';
        childElements[right].className = 'vals';

        left++;
    }

    childElements[pivotFinalIndex].className = yellow;
    await Sleep();
    childElements[pivotFinalIndex].className = red;
    await Sleep();
    if (childElements[pivotFinalIndex] !== childElements[pivotIndex]){
        SwapValues(childElements[pivotFinalIndex], childElements[pivotIndex]);
    } 

    childElements[pivotIndex].className = 'vals';
    childElements[pivotFinalIndex].className = green;

    // Split array into left side of final pivot location, and right side of final pivot location, and recursively call QuickSort function.
    await QuickSort(startIndex, pivotFinalIndex);
    await QuickSort(pivotFinalIndex + 1, arrayLen);

}


async function SelectionSort (e) {
    let sorted = false; // set flag so while loop continues until completely sorted.
    let elementsLen = childElements.length; 

    while (sorted === false) {
        let largesVal = null; // Each loop set largestVal variable to null, until largest value is found.
        let largestValIndex = null; // Index of largest value is needed so old largest value color can change back to blue.
        for (let counter = 0; counter < elementsLen; counter++){
            childElements[counter].className = yellow; 
            await Sleep();
            // 0 index will always start as largest val.
            if (counter == 0){
                largesVal = parseInt(childElements[counter].innerHTML);
                largestValIndex = counter;
                childElements[counter].className = purple; // Purple indicates largest val.
            } 
            else {
                // Set new largestVal when vurrent index value > largest val and change old largest value element back to blue.
                if (parseInt(childElements[counter].innerHTML) > largesVal){
                    childElements[largestValIndex].className = 'vals';

                    largesVal = parseInt(childElements[counter].innerHTML);
                    largestValIndex = counter;
                    childElements[counter].className = purple; // Purple indicates largest val.
                    await Sleep();

                } 
                else {
                    childElements[counter].className = 'vals';
                }
            }

        }
        // Swap with last element if largest value is not in last index. Set to green after to show placement is complete.
        if (largestValIndex !== (elementsLen - 1)){
            SwapValues(childElements[largestValIndex], childElements[elementsLen - 1]);
        } 
        childElements[elementsLen - 1].className = green;

        elementsLen--; // No longer need to look into last index as element is in correct location.

        if (elementsLen === 0){
            sorted = true;
        }
    }
}

async function BubbleSort (e) {

    let sorted = false;
    let divArraySize = contentsDiv.childElementCount - 1;

    // stay in loop until completely sorted.
    while (sorted === false){
        sorted = true;

        // iterate through array.
        for (let counter = 0; counter < divArraySize; counter++){
            el1 = childElements[counter]
            el2 = childElements[counter+1]

            el1.className = yellow;
            el2.className = yellow;
            await Sleep();

            // compare inner text values and swap it left > right.
            if (parseInt(el1.innerHTML) >  parseInt(el2.innerHTML)) {
                sorted = false; // If swap happens set sorted to false and loop again.

                el1.className = red;
                el2.className = red;
                await Sleep();

                SwapValues(el1, el2);
            }
            
            el1.className = green;
            el2.className = green;
            await Sleep();
            
            el1.className = 'vals';
            el2.className = 'vals';

        }
        childElements[divArraySize].className = green;
        divArraySize -= 1; // Largest value in array placed so iterate through array length - 1.
    }

    // Set remaining items to green. They don't turn green if sorted happens early while looping through array.
    for (let count = 0; count < contentsDiv.childElementCount; count++){
        if (childElements[count].className !== green){
            childElements[count].className = green;
        }
    }

    e.preventDefault();
}


// Swap values/styling/class name.
function SwapValues(el1, el2) {
    let placeholder = el1.innerHTML;
    let heightPlaceholder = el1.style.height;
    let classNamePlaceholder = el1.className;

    el1.innerHTML = el2.innerHTML;
    el1.style.height = el2.style.height
    el1.className = el2.className;
    el2.innerHTML = placeholder;
    el2.style.height = heightPlaceholder;
    el2.className = classNamePlaceholder;

}

// Pause sorts for sleep duration. Sleep duration modified by slider input (0-500 ms).
function Sleep () {
    return new Promise(resolve => {
        setTimeout(() => {  
            resolve();
        }, (50 + parseInt(speed.value)));
    })
}
