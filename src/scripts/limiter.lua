-- data for init
local eventID = KEYS[1]
local initData = redis.call('hgetall', eventID)

local function getHashField(arr, name)
  for i, v in ipairs(arr) do
    if(name == v) then
      return arr[i + 1]
    end
  end
end

-- get data from initData
local function getInitDataField(field)
  return tonumber(getHashField(initData, field))
end

local currentTime = redis.call('time')
-- parse to millisecond
local now = (currentTime[1] * 1000000 + currentTime[2]) / 1000
local lastLeaveTime = getInitDataField('lastLeaveTime')
local tokenSupplement = math.floor((now - lastLeaveTime) * getInitDataField('rate'))
local remainTokens = tokenSupplement + getInitDataField('remainCap')

-- need supplement
if tokenSupplement > 0 then
  local cap = getInitDataField('cap')
  -- update leave time to now
  lastLeaveTime = now

  -- token overflow
  if remainTokens > cap then
    remainTokens = cap
  end
end

local hasToken = false

-- attach token to header
if remainTokens >= 1 then
  remainTokens = remainTokens - 1
  hasToken = true
end

-- update 
redis.call('hmset', eventID, 'lastLeaveTime', lastLeaveTime, 'remainCap', remainTokens)

return hasToken