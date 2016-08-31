#

import math
from bson.objectid import ObjectId

class DynamicHasher:
    
    def __init__(self, hash_length):
        self.hash_length = hash_length

    def run(self, input_string):
        padded = self.pad_right(input_string)
        hex_value = self.to_hex(padded)
        objId = ObjectId(hex_value)
        return objId

    # Input: a normal string
    # Output: hex string of 24 characters
    def to_hex(self, padded_string):
        s = padded_string
        n = len(s)
        # Create an array of xor values
        xor = [0] * self.hash_length
        for i in range(0, n):
            xor[i % self.hash_length] = ord(s[i]) ^ xor[i % self.hash_length]

        # Convert it to string
        string_value = self.int_array_to_string(xor)
        # Convert to hex string
        hex_value = string_value.encode('hex')

        return hex_value

    # Make length of a string equals to a multiple of 
    # hash_length by repeating its characters
    def pad_right(self, origin_string):
        new_len = self.hash_length * int(math.ceil(len(origin_string) * 1.0 / self.hash_length))
        diff = new_len - len(origin_string)


        rs = origin_string
        for i in range(0,diff):
            rs += origin_string[i % len(origin_string)]
        return rs

    def int_array_to_string(self, array):
        rs = ''
        for i in array:
            rs += chr(i)
        return rs

    

    