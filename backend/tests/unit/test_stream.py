from datetime import datetime, time, timedelta
from domain.stream import Stream

today = datetime.now()
tomorrow = today + timedelta(1)


def test_should_schedule_stream():
    scheduled_stream = Stream("stream-id", "platform", today)

    assert scheduled_stream.is_completed == False

def test_stream_should_end_with_duration():
    scheduled_stream = Stream("stream-id", "platform", today)
    scheduled_stream.set_duration(timedelta(hours=1))

    assert scheduled_stream.is_completed == True
