module.exports = {
    age: 'Generate a person\'s age 1 to 120',
    alpha: {
        desc: 'Generate a string of letters a to z mixed case',
        variations: {
            'alpha(n)': 'Specify exactly n characters to generate'
        }
    },
    birthday: 'Generate a date of birth in mm/dd/yyyy format or birthday(2) for dd/mm/yyyy',
    bool: 'Generate True or False',
    char: 'Generate one single character of a letter or digits or !@#$%^&*()',
    city: 'Generate a city name',
    ccnumber: 'Generate a Credit Card Number',
    date: {
        desc: 'Generate a date in mm/dd/yyyy format',
        variations: {
            'date(2)': 'dd/mm/yyyy ',
            'date(3)': 'yyyy/mm/dd',
            'date(4)': 'yyyymmdd'
        }
    },
    digit: {
        desc: 'Generate a random number between 5 - 20 digits long',
        variations: {
            'digit(n)': 'Specify exactly n digits to generate'
        }
    },
    dollar: 'Generate a dollar amount in format of $99999.99',
    domain: 'Generate a domain name',
    email: 'Generate a dummy email address',
    first: 'Generate a random first name',
    float: 'Generate a floating/real number with at most four digits to the right of the decimal',
    gender: 'Generate a Male or Female gender',
    guid: 'Generate a Globally Unique Identifier',
    integer: 'Generate a +/- whole number',
    last: 'Generate a random last name',
    latitude: 'Generate a random latitude',
    longitude: 'Generate a random longitude',
    mi: 'Generate a random middle initial - one letter',
    name: 'Generate a random full name',
    natural: {
        desc: 'Generate an integer >= 0',
        variations: {
            'natural(n)': 'Specify exactly n natural numbers to generate'
        }
    },
    paragraph: 'Generate a paragraph of words - three to seven sentences',
    phone: 'Generate a random US phone number 999-999-9999',
    'pick(pick1|pick2|...)': 'Choose one of choices separated by |',
    postal: 'Generate a Canadian postal (see also province)',
    province: 'Generate a Canadian province (see also postal)',
    seq: {
        desc: 'Generate a numeric integer sequence starting at 1 or n and incremented by 1',
        variations: {
            'seq(n)': 'Specify exactly n numbers in a sequence to generate'
        }
    },
    sentence: 'Generate a sentence words - 12 to 18 words',
    state: 'Generate a state code - two letters',
    street: 'Generate a random street address',
    string: {
        desc: 'Generate a random string value of letters,digits, and !@#$%^&*()',
        variations: {
            'string(n)': 'Specify exactly n characters in a string to generate'
        }
    },
    word: 'Generate a random words - five to six letters',
    yn: 'Generate a Y or N value',
    zip: 'Generate a five digit US zip code',
    zip9: 'Generate a nine digit US zip code in 99999-9999 format'
};
